function showTab(tabId) {
    // Ocultar todos los tab-content-items
    document.querySelectorAll('.tab-content-item').forEach(item => {
      item.style.display = 'none';
    });
  
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });
  
    // Mostrar el tab seleccionado
    document.getElementById(tabId).style.display = 'block';
  
    // Activar el botón correspondiente
    const activeButton = document.querySelector(`.tab-button[onclick*="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }
  
  // Mostrar la primera pestaña por defecto
  document.addEventListener('DOMContentLoaded', () => {
    showTab('diagram');
});