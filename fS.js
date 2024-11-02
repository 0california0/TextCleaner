let formattedText = '';
let isTyping = false;

document.getElementById('input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Verhindert einen Zeilenumbruch in Textarea
        cleanAndFormatText();
    }
});

function cleanAndFormatText() {
    const inputText = document.getElementById('input').value;
    const charsToRemove = document.getElementById('charsToRemove').value;
    const regex = new RegExp(`[${charsToRemove}]`, 'g');
    const cleanedText = inputText.replace(regex, '');
    formattedText = formatText(cleanedText);
    typeWriter(formattedText);
}

function formatText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    })
}

function typeWriter(text) {
    const output = document.getElementById('output');
    output.innerHTML = '';
    let i = 0;
    isTyping = true;

    function type() {
        if (i < text.length && isTyping) {
            if (text.substr(i, 4) === '<a h') {
                let endIndex = text.indexOf('</a>', i) + 4;
                output.innerHTML += text.substring(i, endIndex);
                i = endIndex;
            } else {
                output.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(type, 1);
        } else {
            isTyping = false;
            playAnimation();
        }
    }
    type();
}

function skipAndCopy() {
    isTyping = false;
    document.getElementById('output').innerHTML = formattedText;
    playAnimation();
            
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = document.getElementById('output').innerText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Text wurde in die Zwischenablage kopiert!');
}

function playAnimation() {
    const animationContainer = document.getElementById('animation-container');
    animationContainer.style.opacity = '1';
    setTimeout(() => {
        animationContainer.style.opacity = '0';
    }, 3000);
}
function clearInput() {
    document.getElementById('input').value = '';
    document.getElementById('output').innerText = '';
    isTyping = false;
}
function adjustTooltipPosition() {
    const tooltip = document.getElementById('helpTooltip');
    const iconRect = tooltip.parentElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Zurücksetzen der Klassen
    tooltip.classList.remove('adjust-right', 'adjust-left');
    
    // Prüfen, ob der Tooltip über den rechten Bildschirmrand geht
    if (iconRect.left + tooltipRect.width > window.innerWidth) {
        tooltip.classList.add('adjust-right');
    }
    // Prüfen, ob der Tooltip über den linken Bildschirmrand geht
    else if (iconRect.left - (tooltipRect.width / 2) < 0) {
        tooltip.classList.add('adjust-left');
    }
}

// Event-Listener für Hover
document.querySelector('.info-icon').addEventListener('mouseenter', adjustTooltipPosition);

// Event-Listener für Fenstergrößenänderungen
window.addEventListener('resize', adjustTooltipPosition);