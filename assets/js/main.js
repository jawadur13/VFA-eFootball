function loadComponents() {
    const isSubfolder = window.location.pathname.includes('/teams/') ||
        window.location.pathname.includes('/vpl/') ||
        window.location.pathname.includes('/vcl/');

    const prefix = isSubfolder ? '../' : '';

    fetch(prefix + 'components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-header').innerHTML = data;
        });

    fetch(prefix + 'components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-footer').innerHTML = data;
        });

    // Set favicon
    let faviconUrl = prefix + 'assets/images/logos/VFA_logo.png';
    const teamLogoImg = document.querySelector('.team-logo-lg');
    if (teamLogoImg) {
        faviconUrl = teamLogoImg.src;
    }

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = faviconUrl;
}

loadComponents();