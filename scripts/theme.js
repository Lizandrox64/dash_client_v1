// Manejo del tema claro/oscuro
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');

    // Cargar tema guardado o usar el predeterminado
    const savedTheme = localStorage.getItem('itop-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    // Event listener para cambiar tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('itop-theme', newTheme);
        updateThemeButton(newTheme);

        // Actualizar gráficos cuando cambia el tema
        if (window.updateCharts && typeof window.updateCharts === 'function') {
            setTimeout(() => {
                window.updateCharts(window.filteredData || []);
            }, 100);
        }
    });

    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Modo Claro';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Modo Oscuro';
        }
    }
});