const STORAGE_KEY = "autoparts-crm-customers-v1";
const STATUSES = ["New Customer","To Contact","Contacted","Replied","Quoting","Sample Testing","Negotiating","Won","On Hold"];
const TYPES = ["Parts Wholesaler","Parts Distributor","Repair Chain","Independent Repair Shop"];
const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const SOURCES = ["Trade Show","Web Search","Referral","LinkedIn","Cold Outreach","Website Inquiry","Other"];
const SAMPLE_CUSTOMERS = [
  {id:"sample-1",company:"Liberty Auto Supply",contact:"Michael Carter",email:"m.carter@example.com",phone:"(214) 555-0142",website:"https://example.com",city:"Dallas",state:"TX",type:"Parts Wholesaler",brands:"Ford, GM, Ram",products:"Brake pads & rotors",source:"Trade Show",firstContact:"2026-07-10",lastFollowUp:"2026-08-28",nextFollowUp:"2026-09-04",status:"Quoting",notes:"Requested a tiered price list for the Southwest region."},
  {id:"sample-2",company:"Pacific Motor Parts",contact:"Sarah Kim",email:"s.kim@example.com",phone:"(562) 555-0188",website:"https://example.com",city:"Long Beach",state:"CA",type:"Parts Distributor",brands:"Toyota, Honda, Nissan",products:"Filters & ignition coils",source:"LinkedIn",firstContact:"2026-07-22",lastFollowUp:"2026-08-25",nextFollowUp:"2026-09-08",status:"Sample Testing",notes:"Testing filter samples at two distribution centers."},
  {id:"sample-3",company:"Great Lakes Car Care",contact:"Daniel Brooks",email:"d.brooks@example.com",phone:"(312) 555-0119",website:"https://example.com",city:"Chicago",state:"IL",type:"Repair Chain",brands:"Domestic & Asian vehicles",products:"Suspension components",source:"Referral",firstContact:"2026-06-15",lastFollowUp:"2026-08-18",nextFollowUp:"2026-09-03",status:"Negotiating",notes:"34 locations. Reviewing annual-volume terms."},
  {id:"sample-4",company:"Peachtree Auto Service",contact:"Emily Wilson",email:"emily@example.com",phone:"(404) 555-0164",website:"https://example.com",city:"Atlanta",state:"GA",type:"Independent Repair Shop",brands:"BMW, Mercedes-Benz",products:"Sensors & cooling parts",source:"Website Inquiry",firstContact:"2026-08-12",lastFollowUp:"2026-08-29",nextFollowUp:"2026-09-12",status:"Replied",notes:"Interested in a small initial order."},
  {id:"sample-5",company:"Atlantic Parts Network",contact:"Robert Davis",email:"r.davis@example.com",phone:"(973) 555-0137",website:"https://example.com",city:"Newark",state:"NJ",type:"Parts Distributor",brands:"European vehicles",products:"Wheel bearings & hubs",source:"Cold Outreach",firstContact:"2026-05-20",lastFollowUp:"2026-08-20",nextFollowUp:"2026-10-01",status:"Won",notes:"First purchase order received; schedule account review."}
];

const $ = (selector) => document.querySelector(selector);
const cloneSamples = () => SAMPLE_CUSTOMERS.map(customer => ({...customer}));
let customers = loadCustomers();

function loadCustomers() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) ? saved : cloneSamples(); }
  catch { return cloneSamples(); }
}
function saveCustomers() { localStorage.setItem(STORAGE_KEY, JSON.stringify(customers)); }
function fillSelect(selector, values, placeholder) {
  const select = $(selector); select.innerHTML = placeholder ? `<option value="">${placeholder}</option>` : "";
  values.forEach(value => select.add(new Option(value, value)));
}
function formatDate(value) { return value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {month:"short",day:"numeric",year:"numeric"}) : "—"; }
function escapeHtml(value="") { const node=document.createElement("div"); node.textContent=value; return node.innerHTML; }
function statusClass(status) { return `status-${status.toLowerCase().replaceAll(" ", "-")}`; }
function render() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const state = $("#stateFilter").value, type = $("#typeFilter").value, status = $("#statusFilter").value;
  const filtered = customers.filter(c => c.company.toLowerCase().includes(query) && (!state || c.state===state) && (!type || c.type===type) && (!status || c.status===status));
  $("#customerRows").innerHTML = filtered.map(c => `<tr><td><div class="company">${escapeHtml(c.company)}</div><div class="sub">${escapeHtml(c.contact || "No contact")} · ${escapeHtml(c.email || "No email")}</div></td><td>${escapeHtml(c.city || "—")}, ${escapeHtml(c.state || "—")}</td><td>${escapeHtml(c.type || "—")}</td><td>${escapeHtml(c.products || "—")}</td><td><span class="badge ${statusClass(c.status)}">${escapeHtml(c.status)}</span></td><td>${formatDate(c.nextFollowUp)}</td><td><div class="actions"><button class="icon-button edit" data-id="${c.id}" aria-label="Edit ${escapeHtml(c.company)}" title="Edit">✎</button><button class="icon-button delete" data-id="${c.id}" aria-label="Delete ${escapeHtml(c.company)}" title="Delete">×</button></div></td></tr>`).join("");
  $("#resultCount").textContent = `${filtered.length} customer${filtered.length===1?"":"s"}`;
  $("#emptyState").hidden = filtered.length !== 0; $("table").hidden = filtered.length === 0;
  const today = new Date().toISOString().slice(0,10);
  $("#totalStat").textContent=customers.length;
  $("#dueStat").textContent=customers.filter(c=>c.nextFollowUp && c.nextFollowUp<=today && !["Won","On Hold"].includes(c.status)).length;
  $("#quoteStat").textContent=customers.filter(c=>c.status==="Quoting").length;
  $("#wonStat").textContent=customers.filter(c=>c.status==="Won").length;
}
function openForm(customer={}) {
  $("#customerForm").reset(); $("#dialogTitle").textContent=customer.id?"Edit customer":"Add customer";
  Object.entries(customer).forEach(([key,value])=>{const field=$(`#customerForm [name="${key}"]`); if(field) field.value=value||"";});
  $("#customerDialog").showModal(); setTimeout(()=>$("#customerForm [name=company]").focus(),50);
}
function closeForm(){ $("#customerDialog").close(); }
function notify(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200);}

fillSelect("#stateFilter", STATES, "All states"); fillSelect("#typeFilter", TYPES, "All customer types"); fillSelect("#statusFilter", STATUSES, "All statuses");
fillSelect("#formState", STATES, "Select state"); fillSelect("#formType", TYPES, "Select customer type"); fillSelect("#formStatus", STATUSES); fillSelect("#formSource", SOURCES, "Select source");
$("#today").textContent=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
[$("#searchInput"),$("#stateFilter"),$("#typeFilter"),$("#statusFilter")].forEach(el=>el.addEventListener(el.tagName==="INPUT"?"input":"change",render));
$("#clearFilters").addEventListener("click",()=>{$("#searchInput").value="";$("#stateFilter").value="";$("#typeFilter").value="";$("#statusFilter").value="";render();});
$("#addCustomer").addEventListener("click",()=>openForm()); $("#closeDialog").addEventListener("click",closeForm); $("#cancelDialog").addEventListener("click",closeForm);
$("#customerDialog").addEventListener("click",event=>{if(event.target===$("#customerDialog"))closeForm();});
$("#customerForm").addEventListener("submit",event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));const existing=data.id&&customers.findIndex(c=>c.id===data.id);if(existing!==false&&existing>=0)customers[existing]=data;else{data.id=crypto.randomUUID();customers.unshift(data);}saveCustomers();render();closeForm();notify(existing!==false&&existing>=0?"Customer updated":"Customer added");});
$("#customerRows").addEventListener("click",event=>{const button=event.target.closest("button[data-id]");if(!button)return;const customer=customers.find(c=>c.id===button.dataset.id);if(button.classList.contains("edit"))openForm(customer);else if(confirm(`Delete ${customer.company}? This cannot be undone.`)){customers=customers.filter(c=>c.id!==customer.id);saveCustomers();render();notify("Customer deleted");}});
$("#resetData").addEventListener("click",()=>{if(confirm("Reset all local changes and restore the five demo customers?")){customers=cloneSamples();saveCustomers();render();notify("Demo data restored");}});
render();
