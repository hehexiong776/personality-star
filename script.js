// script.js - refactored from single-file version

const questions = [
    { q: "航行模式？", o: ["舰队指挥", "单人漂泊", "护航任务", "外交访问", "深空侦察"], d: "E", s: [5,4,3,2,1] },
    { q: "遭遇陨石带？", o: ["强行突破", "绕道而行", "建立屏障", "呼叫支援", "分析弱点"], d: "N", s: [5,4,3,2,1] },
    { q: "能源管理？", o: ["严格配额", "按需分配", "节省为主", "尽情挥霍", "寻找新能源"], d: "C", s: [5,4,3,2,1] },
    { q: "发现未知生命？", o: ["接触交流", "观察记录", "保护距离", "捕获研究", "分享情报"], d: "A", s: [5,4,3,2,1] },
    { q: "飞船装饰风格？", o: ["实用金属", "艺术涂鸦", "古典庄严", "温馨舒适", "极简虚空"], d: "O", s: [5,4,3,2,1] }
];

const personalities = [
    { type: "🚀 脉冲星指挥官", desc: "你习惯于掌控全局。", traits: ["决断", "战略"], scene: "pulsar", comment: "前方出现规律闪烁的脉冲星。" },
    { type: "🎨 星云流浪者", desc: "你享受自由的漂泊。", traits: ["浪漫", "自由"], scene: "nebula", comment: "你正漂流在一片粉紫色的星云中。" },
    { type: "🛡️ 双星守护者", desc: "你是稳定的基石。", traits: ["忠诚", "稳定"], scene: "binary", comment: "两颗巨大的行星在你周围互旋。" },
    { type: "☄️ 虫洞穿梭客", desc: "你是能量的传递者。", traits: ["活力", "连接"], scene: "wormhole", comment: "前方出现扭曲的虫洞！" },
    { type: "🔭 虚空观测者", desc: "你站在寂静的彼岸。", traits: ["理性", "深邃"], scene: "blackhole", comment: "警告：前方引力异常！" }
];

// Trait -> personalities index mapping (explicit)
const traitToIndex = { E: 0, O: 1, C: 2, A: 3, N: 4 };

let current = 0, answers = [], scores = { O:0, C:0, E:0, A:0, N:0 };
let canvas, ctx, particles = [];
let mouse = { x: innerWidth/2, y: innerHeight/2 };

class Particle {
    constructor() {
        this.x = Math.random() * innerWidth;
        this.y = Math.random() * innerHeight;
        this.z = Math.random() * innerWidth;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.z -= this.speed;
        if (this.z < 1) {
            this.z = innerWidth;
            this.x = Math.random() * innerWidth;
            this.y = Math.random() * innerHeight;
        }
    }
    draw() {
        let perspective = innerWidth / (this.z + innerWidth);
        let x2d = (this.x - innerWidth/2) * perspective + innerWidth/2;
        let y2d = (this.y - innerHeight/2) * perspective + innerHeight/2;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.z/innerWidth})`;
        ctx.arc(x2d, y2d, this.size * (1 - this.z/innerWidth), 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

// UI helpers
function $(id) { return document.getElementById(id); }

function startTest() {
    $('home').style.display = 'none';
    $('quiz').style.display = 'block';
    current = 0; answers = []; scores = { O:0, C:0, E:0, A:0, N:0 };
    loadQuestion();
}

function loadQuestion() {
    const q = questions[current];
    $('q-text').innerText = `星域 ${current+1}/${questions.length}: ${q.q}`;
    const opts = $('options');
    opts.innerHTML = '';
    q.o.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.type = 'button';
        btn.innerText = opt;
        btn.setAttribute('data-index', i);
        btn.addEventListener('click', () => select(i, btn));
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i, btn); }
        });
        opts.appendChild(btn);
    });
}

function select(i, el) {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    answers[current] = i;
}

function next() {
    if (answers[current] === undefined) { alert("请选择探测方向！"); return; }
    const q = questions[current];
    const val = (q.s && q.s[answers[current]] !== undefined) ? q.s[answers[current]] : (q.o.length - answers[current]);
    const dim = q.d;
    scores[dim] += val;
    current++;
    if (current < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    $('quiz').style.display = 'none';
    $('result').style.display = 'block';

    // find dominant trait
    let maxScore = -Infinity;
    let dominantTrait = null;
    for (const key in scores) {
        if (scores[key] > maxScore) { maxScore = scores[key]; dominantTrait = key; }
    }

    const idx = traitToIndex[dominantTrait] ?? 0;
    const matched = personalities[idx] || personalities[0];

    $('scene-title').innerText = matched.type;
    $('type-desc').innerText = matched.desc;
    $('scene-desc').innerText = matched.comment;
    $('traits').innerHTML = matched.traits.map(t => `<span style="display:inline-block;background:rgba(138,43,226,0.2);padding:5px 10px;border-radius:15px">${t}</span>`).join('');

    // persist last result for quick reference
    try { localStorage.setItem('personality-star:last', JSON.stringify({ matched, scores })); } catch (e) { /* ignore */ }
}

window.onload = () => {
    canvas = document.getElementById('universe');
    ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
    animate();
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; initParticles(); });

    // wire UI
    $('start-btn').addEventListener('click', startTest);
    $('next-btn').addEventListener('click', next);
    $('restart-btn').addEventListener('click', () => location.reload());

    // expose ids used in markup for convenience
    window.home = $('home');
    window.quiz = $('quiz');
    window.result = $('result');
};
