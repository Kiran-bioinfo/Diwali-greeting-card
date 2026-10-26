// Store user uploaded image
let userUploadedImage = null;

// Random Diwali Wishes Array
const diwaliWishes = [
    { text: "The festival of lights is here<br>bringing joy and happiness.<br>May Goddess Lakshmi bless you<br>and make every day golden.<br><br>Happy Diwali", color: "#B23A2E" },
    { text: "Light the lamps, spread the glow,<br>celebrate the joy of Diwali.<br>May all your dreams come true.<br>This is my wish for you.<br><br>Happy Diwali", color: "#B23A2E" },
    { text: "May the echoes of crackers be loud,<br>may the diyas shine bright,<br>may sweets bring sweetness,<br>and happiness fill your life.<br><br>Happy Diwali", color: "#D98A2B" },
    { text: "May Goddess Lakshmi visit your home,<br>bringing loads of happiness.<br>May success and prosperity stay.<br>This is my Diwali wish.<br><br>Happy Diwali", color: "#B23A2E" },
    { text: "May the lamps shine, darkness fade,<br>may your home be filled with joy,<br>may your life be full of light.<br>This is the Diwali wish.<br><br>Happy Diwali", color: "#2E4B3C" },
    { text: "The lovely festival of Diwali<br>brings a treasure of happiness.<br>May success come at every step,<br>may you stay happy and healthy.<br><br>Happy Diwali", color: "#B23A2E" },
    { text: "May your home be full of light,<br>may your courtyard bloom with joy,<br>may Goddess Lakshmi bless you.<br>This is my prayer this Diwali.<br><br>Happy Diwali", color: "#D98A2B" },
    { text: "May the light of diyas<br>light up your life.<br>May sweets bring sweetness,<br>and crackers bring joy.<br><br>Happy Diwali", color: "#2E4B3C" },
    { text: "Fragrance of flowers, colors of rangoli,<br>light of diyas, taste of sweets.<br>May everything be in your life.<br>Wishing you a happy Diwali.<br><br>Happy Diwali", color: "#B23A2E" },
    { text: "May prosperity enter your home,<br>may every day bring new light,<br>may the blessing stay.<br>This is my wish from the heart.<br><br>Happy Diwali", color: "#B23A2E" }
];

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showToast('Photo must be under 5MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            // Compress for URL sharing (no backend), keeping good quality.
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
                const maxSize = 400;
                if (width > height) {
                    if (width > maxSize) { height *= maxSize / width; width = maxSize; }
                } else {
                    if (height > maxSize) { width *= maxSize / height; height = maxSize; }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                userUploadedImage = canvas.toDataURL('image/jpeg', 0.8);
                const preview = document.getElementById('uploadPreview');
                preview.innerHTML = `<img src="${userUploadedImage}" alt="Preview">`;
                document.getElementById('removeImageBtn').classList.remove('hidden');
                document.getElementById('uploadText').textContent = 'Photo added';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    userUploadedImage = null;
    document.getElementById('userImage').value = '';
    document.getElementById('uploadPreview').innerHTML = '';
    document.getElementById('removeImageBtn').classList.add('hidden');
    document.getElementById('uploadText').textContent = 'Add a photo (optional)';
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function decodeImageFromUrl(encoded) {
    try {
        let decoded = decodeURIComponent(encoded);
        if (decoded && decoded.startsWith('data:image')) return decoded;
        if (encoded && encoded.startsWith('data:image')) return encoded;
    } catch (e) {}
    return null;
}

function getRandomWishForUser(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash;
    }
    return diwaliWishes[Math.abs(hash) % diwaliWishes.length];
}

// Fireworks (single bloom)
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.velocity = { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        this.velocity.y += 0.08;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}
let particles = [];
const bloomColors = ['#C8322B', '#E89A2C', '#D4A84B', '#2A0E1F'];

function bloom(x, y) {
    const color = bloomColors[Math.floor(Math.random() * bloomColors.length)];
    for (let i = 0; i < 16; i++) particles.push(new Particle(x, y, color));
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        if (p.alpha <= 0) particles.splice(i, 1);
        else { p.update(); p.draw(); }
    });
    requestAnimationFrame(animateFireworks);
}
animateFireworks();

// Rangoli builder
function buildRangoli() {
    document.querySelectorAll('.rangoli').forEach(svg => {
        const dotring = svg.querySelector('.dotring');
        const petalsBig = svg.querySelector('.petals-big');
        const petalsSmall = svg.querySelector('.petals-small');
        const dotringInner = svg.querySelector('.dotring-inner');

        // outer dot ring: 16 dots on radius 210
        if (dotring) {
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', 250 + Math.cos(a) * 210);
                c.setAttribute('cy', 250 + Math.sin(a) * 210);
                c.setAttribute('r', 4);
                c.classList.add('dot');
                dotring.appendChild(c);
            }
        }
        // 8 big petals on radius 150
        if (petalsBig) {
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const x = 250 + Math.cos(a) * 150;
                const y = 250 + Math.sin(a) * 150;
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                p.setAttribute('cx', x);
                p.setAttribute('cy', y);
                p.setAttribute('rx', 34);
                p.setAttribute('ry', 62);
                p.setAttribute('transform', `rotate(${(a * 180) / Math.PI + 90}, ${x}, ${y})`);
                p.classList.add('petal-big');
                petalsBig.appendChild(p);
            }
        }
        // 8 small petals on radius 95, rotated 22.5deg
        if (petalsSmall) {
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + Math.PI / 8;
                const x = 250 + Math.cos(a) * 95;
                const y = 250 + Math.sin(a) * 95;
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                p.setAttribute('cx', x);
                p.setAttribute('cy', y);
                p.setAttribute('rx', 18);
                p.setAttribute('ry', 36);
                p.setAttribute('transform', `rotate(${(a * 180) / Math.PI + 90}, ${x}, ${y})`);
                p.classList.add('petal-small');
                petalsSmall.appendChild(p);
            }
        }
        // inner dot ring: 8 dots on radius 60
        if (dotringInner) {
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', 250 + Math.cos(a) * 60);
                c.setAttribute('cy', 250 + Math.sin(a) * 60);
                c.setAttribute('r', 3);
                c.classList.add('dot');
                dotringInner.appendChild(c);
            }
        }
    });
}

function updateRangoli() {
    const name = document.getElementById('userName').value.trim();
    const len = name.length;
    const svg = document.querySelector('.rangoli:not(.small)');
    if (!svg) return;
    const all = svg.querySelectorAll('.dot, .petal-big, .petal-small');
    const total = all.length;
    const lit = Math.min(len * 2, total);
    all.forEach((el, i) => el.classList.toggle('lit', i < lit));
}

// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => t.classList.add('hidden'), 2400);
}

// Main logic
window.addEventListener('DOMContentLoaded', async () => {
    buildRangoli();
    const userName = getUrlParameter('name');
    const wishId = getUrlParameter('id');
    const userImageParam = getUrlParameter('img');

    const themeParam = getUrlParameter('theme');
    if (themeParam) setTheme(themeParam, false);

    if (userName) {
        if (userImageParam) {
            const decoded = decodeImageFromUrl(userImageParam);
            if (decoded) userUploadedImage = decoded;
        }
        showGift(userName);
    }

    const input = document.getElementById('userName');
    if (input) input.addEventListener('input', updateRangoli);
});

async function createWish() {
    const input = document.getElementById('userName');
    const name = input.value.trim();
    if (!name) {
        showToast('Please enter your name.');
        return;
    }

    let url = window.location.origin + window.location.pathname + '?name=' + encodeURIComponent(name);
    if (window._theme && window._theme !== 'maroon') url += '&theme=' + window._theme;

    if (userUploadedImage) {
        url += '&img=' + encodeURIComponent(userUploadedImage);
    }

    copyToClipboard(url);
    showGift(name);
}

function showGift(name) {
    document.getElementById('nameForm').classList.add('hidden');
    document.getElementById('giftContainer').classList.remove('hidden');
    const box = document.getElementById('giftBox');
    box.onclick = () => openGift(name);
}

function openGift(name) {
    const giftContainer = document.getElementById('giftContainer');
    const wishContainer = document.getElementById('wishContainer');
    const displayName = document.getElementById('displayName');
    const wishText = document.getElementById('wishText');
    const userImageContainer = document.getElementById('userImageContainer');
    const displayUserImage = document.getElementById('displayUserImage');

    const userWish = getRandomWishForUser(name);

    // bloom
    const rect = document.getElementById('giftBox').getBoundingClientRect();
    bloom(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // start music on first open
    const audio = document.getElementById('bgAudio');
    if (audio && !audioPlaying) {
        audio.play().then(() => { audioPlaying = true; document.getElementById('audioToggle').textContent = '♬'; }).catch(() => {});
    }

    document.querySelector('.rangoli:not(.small)').classList.add('bloom');

    setTimeout(() => {
        giftContainer.classList.add('hidden');
        wishContainer.classList.remove('hidden');
        displayName.textContent = name;
        displayName.style.color = userWish.color;
        wishText.innerHTML = userWish.text;

        const wishMedallion = document.querySelector('.wish-medallion');
        if (userUploadedImage) {
            displayUserImage.src = userUploadedImage;
            userImageContainer.classList.remove('hidden');
            if (wishMedallion) wishMedallion.classList.add('has-photo');
        } else {
            userImageContainer.classList.add('hidden');
            if (wishMedallion) wishMedallion.classList.remove('has-photo');
        }
    }, 900);
}

async function shareWish() {
    const name = document.getElementById('displayName').textContent;
    let url = window.location.origin + window.location.pathname + '?name=' + encodeURIComponent(name);
    if (window._theme && window._theme !== 'maroon') url += '&theme=' + window._theme;

    if (userUploadedImage) {
        url += '&img=' + encodeURIComponent(userUploadedImage);
    }

    const message = `"${name}" sent you a Diwali gift!\n\nHappy Diwali! 🪔\n\n${url}`;

    // Try to share the wish card as an image (mobile Web Share API).
    if (typeof htmlToImage !== 'undefined' && navigator.canShare) {
        try {
            const node = document.querySelector('.wish-frame');
            const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 3 });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'diwali-wish.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], text: message, title: 'Happy Diwali' });
                return;
            }
        } catch (e) {
            console.warn('Image share failed:', e);
        }
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappUrl = isMobile
        ? `whatsapp://send?text=${encodeURIComponent(message)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
    }
}

function copyLink() {
    const name = document.getElementById('displayName').textContent;
    let url = window.location.origin + window.location.pathname + '?name=' + encodeURIComponent(name);
    copyToClipboard(url);
    showToast('Link copied. Share it anywhere.');
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(textarea);
}

// Themes
function setTheme(name, updateSwatch = true) {
    const allowed = ['maroon', 'saffron', 'emerald', 'indigo'];
    if (!allowed.includes(name)) name = 'maroon';
    document.body.classList.remove('theme-maroon', 'theme-saffron', 'theme-emerald', 'theme-indigo');
    document.body.classList.add('theme-' + name);
    if (updateSwatch) {
        document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
        const sw = document.querySelector('.theme-swatch[data-theme="' + name + '"]');
        if (sw) sw.classList.add('active');
    }
    window._theme = name;
}

// Audio
let audioPlaying = false;
function toggleAudio() {
    const audio = document.getElementById('bgAudio');
    const btn = document.getElementById('audioToggle');
    if (audioPlaying) {
        audio.pause();
        audioPlaying = false;
        btn.textContent = '♫';
    } else {
        audio.play().then(() => {
            audioPlaying = true;
            btn.textContent = '♬';
        }).catch(() => {});
    }
}

// Export wish card as image
async function exportCard() {
    if (typeof htmlToImage === 'undefined') {
        showToast('Image export unavailable.');
        return;
    }
    const node = document.querySelector('.wish-frame');
    try {
        const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 3, backgroundColor: null });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'diwali-wish.png';
        a.click();
        showToast('Image saved.');
    } catch (e) {
        console.error(e);
        showToast('Could not save image.');
    }
}

function createYourOwn() {
    userUploadedImage = null;
    document.getElementById('userImage').value = '';
    document.getElementById('uploadPreview').innerHTML = '';
    document.getElementById('removeImageBtn').classList.add('hidden');
    document.getElementById('uploadText').textContent = 'Add a photo (optional)';
    document.getElementById('userName').value = '';
    document.getElementById('wishContainer').classList.add('hidden');
    document.getElementById('nameForm').classList.remove('hidden');
    document.querySelector('.rangoli:not(.small)').classList.remove('bloom');
    const dots = document.querySelectorAll('.rangoli:not(.small) .dot, .rangoli:not(.small) .petal');
    dots.forEach(d => d.classList.remove('lit'));
}
