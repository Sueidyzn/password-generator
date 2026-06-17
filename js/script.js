const lenSlider = document.getElementById('len');
const lenOut = document.getElementById("len-out");
const senhaOut = document.getElementById("senha-out");
const bar = document.getElementById('bar');
const strengthLabel = document.getElementById('strength-label');
const entropyOut = document.getElementById('entropy-out');
const copyBtn = document.getElementById('copy-btn');

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const AMBIG = /[0Ol1I]/g;

function getCharset() {
    let charset = '';
    if(document.getElementById('opt-upper').checked) charset += UPPER;
    if(document.getElementById('opt-lower').checked) charset += LOWER;
    if(document.getElementById('opt-digits').checked) charset += DIGITS;
    if(document.getElementById('opt-symbols').checked) charset += SYMBOLS;
    if(document.getElementById('opt-ambiguos').checked) charset = charset.replace(AMBIG, '');
    return charset;
}

function generatePassword(len, charset){
    if(!charset) return '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(v => charset[v % charset.length]).join('');
}

function calcEntropy(len, charsetSize){
    if(charsetSize === 0) return 0;
    return Math.round(len * Math.log2(charsetSize));
}

function updateStrength(bits){
    let label, color, pct;
    if(bits < 28) { label = 'Muito fraca'; color = '#E24B4A'; pct = 8;}
    else if(bits < 40) { label = 'fraca'; color = '#E24B4A'; pct = 22;}
    else if(bits < 60) { label = 'Média'; color = '#EF9F27'; pct = 48;}
    else if(bits < 80) { label = 'Forte'; color = '#1D9E75'; pct = 72;}
    else if(bits < 100) {label = 'Muito forte'; color = '#1D9E75'; pct = 88;}
    else                {label = 'Excelente'; color = '#1D9E75'; pct = 100}
    bar.style.width = pct + '%';
    bar.style.background = color;
    strengthLabel.textContent = label;
    strengthLabel.style.color = color;
    entropyOut.textContent = bits + 'bits de entropia';
}

function generate(){
    const len = parseInt(lenSlider.value);
    const charset = getCharset();
    if(!charset){
        senhaOut.textContent = 'Selecione pelo menos um tipo';
        bar.style.width = '0%';
        strengthLabel.textContent = "";
        entropyOut.textContent = '';
        return;
    }
    const pwd = generatePassword(len, charset);
    senhaOut.textContent = pwd;
    const bits = calcEntropy(len, charset.length);
    updateStrength(bits);
}

lenSlider.addEventListener('input', ()=>{
    lenOut.textContent = lenSlider.value;
    generate();
});

['opt-upper','opt-lower','opt-digits','opt-symbols','opt-ambiguos'].forEach(id => {
    document.getElementById(id).addEventListener('change', generate);
});

document.getElementById('gen-btn').addEventListener('click', generate);

copyBtn.addEventListener('click', ()=>{
    const pwd = senhaOut.textContent;
    if(!pwd || pwd.length < 4) return;
    navigator.clipboard.writeText(pwd).then(()=>{
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => {
            copyBtn.textContent = 'Copiar';
        }, 1800);
    });
});

generate();