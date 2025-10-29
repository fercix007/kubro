// main.js - lógica de interacción (sidebar, tabs, modales, tablas, animaciones)

// --- Datos de prueba ---
const salesData = [
  { id:1001, clinic:'Stella Maris', quoteCode:'QSM-1001-2025', contractorName:'Ana García', contractorDNI:'12345678', email:'ana.g@mail.com', phone:'987654321', regDate:'2025-09-01', regAdvisor:'Juan Pérez', lastModDate:'2025-09-10', lastModAdvisor:'Admin', missingData:'No', numAffiliates:3, premiumType:'Mensual', premiumAmount:270.00, withdrawn:'No', paymentStatus:'Aceptado', isComplete:true, hasMissingData:false, isPending:false},
  { id:1002, clinic:'Padre Tezza', quoteCode:'QPT-1002-2025', contractorName:'Roberto Gómez', contractorDNI:'87654321', email:'roberto.g@mail.com', phone:'912345678', regDate:'2025-09-02', regAdvisor:'Marta León', lastModDate:'2025-09-05', lastModAdvisor:'Marta León', missingData:'Sí', numAffiliates:1, premiumType:'Anual', premiumAmount:1500.00, withdrawn:'No', paymentStatus:'Pendiente', isComplete:false, hasMissingData:true, isPending:true},
  { id:1003, clinic:'Stella Maris', quoteCode:'QSM-1003-2025', contractorName:'Luisa Flores', contractorDNI:'45678901', email:'luisa.f@mail.com', phone:'954321098', regDate:'2025-09-03', regAdvisor:'Back Office', lastModDate:'2025-09-03', lastModAdvisor:'Back Office', missingData:'No', numAffiliates:4, premiumType:'Mensual', premiumAmount:450.00, withdrawn:'Sí', paymentStatus:'Anulado', isComplete:true, hasMissingData:false, isPending:false},
  { id:1004, clinic:'Padre Tezza', quoteCode:'QPT-1004-2025', contractorName:'Javier Castro', contractorDNI:'67890123', email:'javier.c@mail.com', phone:'934567890', regDate:'2025-09-04', regAdvisor:'Juan Pérez', lastModDate:'2025-09-15', lastModAdvisor:'Admin', missingData:'No', numAffiliates:2, premiumType:'Mensual', premiumAmount:200.00, withdrawn:'No', paymentStatus:'Rechazado', isComplete:true, hasMissingData:false, isPending:false},
  { id:1005, clinic:'Stella Maris', quoteCode:'QSM-1005-2025', contractorName:'Elena Torres', contractorDNI:'90123456', email:'elena.t@mail.com', phone:'923456789', regDate:'2025-09-05', regAdvisor:'Admin', lastModDate:'2025-09-18', lastModAdvisor:'Admin', missingData:'Sí', numAffiliates:5, premiumType:'Mensual', premiumAmount:550.00, withdrawn:'No', paymentStatus:'Pendiente', isComplete:false, hasMissingData:true, isPending:true}
];

const quotationData = [
  { id:2001, quoteCode:'C-2001-SM', clinic:'Stella Maris', name:'Pedro López', email:'pedro.l@mail.com', phone:'900111222', age:45, numAffiliates:2, monthlyPremium:150.00, annualPremium:1800.00, regDate:'2025-09-15', regAdvisor:'N/A', lastModDate:'2025-09-15', lastModAdvisor:'Sistema', route:'Ruta 1'},
  { id:2002, quoteCode:'C-2002-PT', clinic:'Padre Tezza', name:'María Vílchez', email:'maria.v@mail.com', phone:'900333444', age:30, numAffiliates:4, monthlyPremium:320.00, annualPremium:3840.00, regDate:'2025-09-16', regAdvisor:'Juan Pérez', lastModDate:'2025-09-17', lastModAdvisor:'Juan Pérez', route:'Asistida'},
  { id:2003, quoteCode:'C-2003-SM', clinic:'Stella Maris', name:'Ricardo Salas', email:'ricardo.s@mail.com', phone:'900555666', age:25, numAffiliates:1, monthlyPremium:90.00, annualPremium:1080.00, regDate:'2025-09-17', regAdvisor:'N/A', lastModDate:'2025-09-17', lastModAdvisor:'Sistema', route:'Ruta 2'},
  { id:2004, quoteCode:'C-2004-PT', clinic:'Padre Tezza', name:'Sofía Ramos', email:'sofia.r@mail.com', phone:'900777888', age:50, numAffiliates:3, monthlyPremium:400.00, annualPremium:4800.00, regDate:'2025-09-18', regAdvisor:'Marta León', lastModDate:'2025-09-19', lastModAdvisor:'Marta León',  route:'Asistida'}
];

// Utility - badges
const getPaymentStatusBadge = (status) => {
  let color = 'bg-secondary text-dark';
  switch(status){
    case 'Aceptado': return `<span class="badge text-white" style="background:#10b981">${status}</span>`;
    case 'Pendiente': return `<span class="badge text-dark" style="background:#f59e0b">${status}</span>`;
    case 'Rechazado': return `<span class="badge text-white" style="background:#ef4444">${status}</span>`;
    case 'Anulado': return `<span class="badge text-white" style="background:#6b7280">${status}</span>`;
    default: return `<span class="badge bg-light text-dark">${status}</span>`;
  }
};
const getQuotationStatusBadge = (status) => {
  switch(status){
    default: return ``;
  }
};

// Render sales grid
const renderSalesGrid = (data) => {
  const tbody = document.getElementById('sales-grid-body');
  tbody.innerHTML = '';
  data.forEach(sale=>{
    const tr = document.createElement('tr');
    tr.className = 'align-middle';
    tr.innerHTML = `
      <td style="min-width:110px">
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-light" title="Acciones" onclick="toggleActionsMenu(event, ${sale.id})"><i class="fas fa-ellipsis-v"></i></button>
          <div id="actions-menu-${sale.id}" class="dropdown-actions d-none card p-2">
            <div class="mb-1"><button class="btn btn-sm w-100 btn-outline-primary" onclick="sendConfirmationEmail(${sale.id}); closeAllActionMenus();">Enviar confirmación</button></div>
            <div class="mb-1"><button class="btn btn-sm w-100 btn-outline-secondary" onclick="verifyEmails('${sale.email}'); closeAllActionMenus();">Verificar correos</button></div>
            <div class="mb-1"><button class="btn btn-sm w-100 btn-outline-success" onclick="sendToCore(${sale.id}); closeAllActionMenus();">Enviar a Core</button></div>
            <div class="mb-1"><button class="btn btn-sm w-100 btn-outline-warning" onclick="sendMissingDataEmail(${sale.id}); closeAllActionMenus();">Enviar datos faltantes</button></div>
            <div><button class="btn btn-sm w-100 btn-outline-danger" onclick="showCancelModal(${sale.id}); closeAllActionMenus();">Anular</button></div>
          </div>
        </div>
      </td>
      <td>${sale.clinic}</td>
      <td><i class="fas fa-file-pdf text-danger action-icon" title="Ver PDF" onclick="openQuotePDF('${sale.quoteCode}')"></i></td>
      <td class="font-monospace">${sale.quoteCode}</td>
      <td>${sale.contractorName}</td>
      <td>${sale.contractorDNI}</td>
      <td>${sale.email}</td>
      <td>${sale.phone}</td>
      <td>${sale.regDate}</td>
      <td>${sale.regAdvisor}</td>
      <td>${sale.lastModDate}</td>
      <td>${sale.lastModAdvisor}</td>
      <td>${sale.missingData}</td>
      <td class="text-center">${sale.numAffiliates}</td>
      <td>${sale.premiumType}</td>
      <td class="fw-bold">S/ ${sale.premiumAmount.toFixed(2)}</td>
      <td>${sale.withdrawn}</td>
      <td>${getPaymentStatusBadge(sale.paymentStatus)}</td>
      <td><button class="btn btn-sm btn-outline-info" onclick="goToPaymentLink(${sale.id})"><i class="fas fa-link"></i></button></td>
      <td><button class="btn btn-sm btn-outline-success" onclick="showDetailModal(${sale.id})"><i class="fas fa-info-circle"></i></button></td>
      <td><button class="btn btn-sm btn-outline-purple" onclick="showCompletePaymentModal(${sale.id})"><i class="fas fa-money-check-alt"></i></button></td>
      <td><button class="btn btn-sm btn-teal" onclick="redirectToEcommerce(${sale.id})"><i class="fas fa-external-link-square-alt"></i></button></td>
    `;
    tbody.appendChild(tr);
  });
};

// Render quotation grid
const renderQuotationGrid = (data) => {
  const tbody = document.getElementById('quotation-grid-body');
  tbody.innerHTML = '';
  data.forEach(q=>{
    const tr = document.createElement('tr');
    tr.className='align-middle';
    tr.innerHTML = `
      <td class="font-monospace">${q.quoteCode}</td>
      <td>${q.clinic}</td>
      <td class="fw-semibold">${q.name}</td>
      <td>${q.email}</td>
      <td>${q.phone}</td>
      <td>${q.age}</td>
      <td class="text-center">${q.numAffiliates}</td>
      <td class="fw-bold">S/ ${q.monthlyPremium.toFixed(2)}</td>
      <td class="fw-bold">S/ ${q.annualPremium.toFixed(2)}</td>
      <td>${q.regDate}</td>
      <td>${q.regAdvisor}</td>
      <td>${q.lastModDate}</td>
      <td>${q.lastModAdvisor}</td>
      <td>
        <div class="d-flex gap-1 align-items-center">
          ${getQuotationStatusBadge(q.status)}
          <button class="btn btn-sm btn-light" onclick="toggleRouteMenu(event, ${q.id})"><i class="fas fa-ellipsis-v"></i></button>
          <div id="route-menu-${q.id}" class="dropdown-actions d-none card p-2">
            <button class="btn btn-sm w-100 text-start" onclick="setQuotationRoute(${q.id}, 'Asistida')">Asistida</button>
            <button class="btn btn-sm w-100 text-start" onclick="setQuotationRoute(${q.id}, 'Ruta 1')">Ruta 1</button>
            <button class="btn btn-sm w-100 text-start" onclick="setQuotationRoute(${q.id}, 'Ruta 2')">Ruta 2</button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// --- Actions and helpers ---
const closeAllActionMenus = () => {
  document.querySelectorAll('.dropdown-actions').forEach(el => el.classList.add('d-none'));
};
const toggleActionsMenu = (e, id) => {
  e.stopPropagation();
  closeAllActionMenus();
  const el = document.getElementById(`actions-menu-${id}`);
  if(el) el.classList.toggle('d-none');
};
const toggleRouteMenu = (e, id) => {
  e.stopPropagation();
  closeAllActionMenus();
  const el = document.getElementById(`route-menu-${id}`);
  if(el) el.classList.toggle('d-none');
};
const setQuotationRoute = (id, route) => {
  const idx = quotationData.findIndex(q=>q.id===id);
  if(idx!==-1){ quotationData[idx].route = route; renderQuotationGrid(quotationData); alert(`[SIMULACIÓN] Ruta actualizada a "${route}" para la cotización ${id}.`); }
};

document.addEventListener('click', ()=> closeAllActionMenus());

// Modals
/*
const openModal = (id) => {
  const m = document.getElementById(id);
  if(!m) return;
  m.classList.remove('d-none');
  m.style.opacity = 0;
  setTimeout(()=>{ m.style.opacity = 1; }, 10);
};
const closeModal = (id) => {
  const m = document.getElementById(id);
  if(!m) return;
  m.style.opacity = 0;
  setTimeout(()=>{ m.classList.add('d-none'); }, 400);
};
*/
const showDetailModal = (id) => { document.getElementById('detail-id').textContent = id; openModal('detail-modal'); };
const showCompletePaymentModal = (id) => { openModal('complete-payment-modal'); };
const showCancelModal = (id) => { document.getElementById('cancel-id').textContent = id; openModal('cancel-modal'); };
const showAssignSalespersonModal = (id) => { openModal('assign-salesperson-modal'); };

// Simulated actions
const sendConfirmationEmail = (id) => { alert(`[SIMULACIÓN] Enviando correo de confirmación de pago para la venta ${id}.`); };
const verifyEmails = (email) => { window.open(`https://mail.google.com/mail/u/0/#search/to%3A${email}`,'_blank'); };
const sendToCore = (id) => { alert(`[SIMULACIÓN] Enviando registro de afiliación al Módulo Core para la venta ${id}.`); };
const sendMissingDataEmail = (id) => { alert(`[SIMULACIÓN] Enviando correo de datos faltantes para la venta ${id}.`); };
const openQuotePDF = (code) => { window.open(`https://ejemplo.com/cotizaciones/${code}.pdf`,'_blank'); };
const goToPaymentLink = (id) => { window.open(`https://ecom.kubro.com/pay/${id}`,'_blank'); };
const refreshPaymentLink = (id) => { alert(`[SIMULACIÓN] Generando nuevo link de pago para la venta ${id}.`); };
const redirectToEcommerce = (id) => { window.open(`https://ecom.kubro.com/quote-preload?id=${id}&data=test_data`,'_blank'); };

// Filters / export (simulated)
const filterSales = () => { alert('[SIMULACIÓN] Aplicando filtros en el Reporte de Ventas.'); };
const exportSales = () => { alert('[SIMULACIÓN] Exportando la información visible de la grilla de ventas a un archivo Excel.'); };
const filterQuotations = () => { alert('[SIMULACIÓN] Aplicando filtros en el Reporte de Cotizaciones.'); };
const exportQuotations = () => { alert('[SIMULACIÓN] Exportando las cotizaciones visibles a un archivo Excel.'); };

// Sidebar & tabs logic with animations (0.4s)
const initUI = () => {
  const sidebar = document.getElementById('sidebar');
  const btnToggle = document.getElementById('btn-toggle-sidebar');
  const sociosToggle = document.getElementById('socios-toggle');
  const sociosSubmenu = document.getElementById('socios-submenu');
  const sociosArrow = document.getElementById('socios-arrow');
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const mainTitle = document.getElementById('page-heading');

  // Sidebar collapse on small screens
  btnToggle.addEventListener('click', ()=>{
    sidebar.classList.toggle('collapsed');
  });

  // Socios submenu toggle
  sociosToggle.addEventListener('click', (e)=>{ e.preventDefault(); sociosSubmenu.classList.toggle('d-none'); sociosArrow.classList.toggle('rotate-180'); });

  // Tabs switching
  const switchTab = (tabId, titleText) => {
    tabPanels.forEach(p=>{ p.classList.add('d-none'); p.classList.remove('fade-in'); });
    const active = document.getElementById(tabId);
    if(active){ active.classList.remove('d-none'); setTimeout(()=> active.classList.add('fade-in'), 20); }

    sidebarItems.forEach(it=> it.classList.remove('active'));
    const activeItem = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);
    if(activeItem) activeItem.classList.add('active');

    // update heading
    if(mainTitle) mainTitle.textContent = titleText || 'Dashboard de Ventas';

    // actions on tab load
    if(tabId === 'tab-step1') renderSalesGrid(salesData);
    if(tabId === 'tab-step2') renderQuotationGrid(quotationData);
  };

  sidebarItems.forEach(item=>{
    const tab = item.getAttribute('data-tab');
    const text = item.textContent.trim();
    if(tab){
      item.addEventListener('click', (e)=>{ e.preventDefault(); switchTab(tab, text); });
    }
  });

  // initial state
  switchTab('tab-dashboard','Dashboard de Ventas');
};

document.addEventListener('DOMContentLoaded', ()=>{
  initUI();
  // initial rendering of dashboard numbers and tables
  document.getElementById('accepted-sales-count').textContent = '3,852';
  document.getElementById('pending-sales-count').textContent = '485';
  document.getElementById('rejected-sales-count').textContent = '129';
  document.getElementById('assisted-sales-count').textContent = '1,104';
  document.getElementById('nonassisted-sales-count').textContent = '2,748';
  document.getElementById('canceled-sales-count').textContent = '42';
});