(() => {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');


    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(canvas.clientWidth * dpr);
        canvas.height = Math.floor(canvas.clientHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();


    // Элементы управления
    const S = {
        iters: document.getElementById('iters'),
        disp: document.getElementById('disp'),
        rough: document.getElementById('rough'),
        seed: document.getElementById('seed'),
        leftH: document.getElementById('leftH'),
        rightH: document.getElementById('rightH'),
        generate: document.getElementById('generate'),
        prev: document.getElementById('prev'),
        next: document.getElementById('next'),
        play: document.getElementById('play'),
        stop: document.getElementById('stop'),
        mode: document.getElementById('mode'),
        // labels
        itersVal: document.getElementById('itersVal'),
        dispVal: document.getElementById('dispVal'),
        roughVal: document.getElementById('roughVal'),
        leftHVal: document.getElementById('leftHVal'),
        rightHVal: document.getElementById('rightHVal')
    };


    // Update label UI
    function updateLabels() {
        S.itersVal.textContent = S.iters.value;
        S.dispVal.textContent = S.disp.value;
        S.roughVal.textContent = S.rough.value;
        S.leftHVal.textContent = S.leftH.value;
        S.rightHVal.textContent = S.rightH.value;
    }
    Object.values(S).forEach(el => { if (el && el.tagName === 'INPUT') el.addEventListener('input', updateLabels); });
    updateLabels();

    // Линейный конгруэнтный генератор
    function makeRNG(seed) {
        let s = seed >>> 0;
        if (s === 0) s = 123456789;
        return function () {
            s = (1664525 * s + 1013904223) >>> 0;
            return s / 4294967296;
        }
    }


    // Реализация алгоритма "Midpoint Displacement"
    function generateProfile({ width, iters, initialDisp, roughness, leftH, rightH, seed }) {
        // Если задан seed — создаём детерминированный генератор случайных чисел, иначе используем Math.random()
        const rng = seed != null ? makeRNG(seed) : Math.random;

        // Начальные точки профиля: левая и правая крайние точки линии
        // Каждая точка — объект {x, y}
        const points = [{ x: 0, y: leftH }, { x: width, y: rightH }];

        // Массив "steps" будет хранить все промежуточные шаги алгоритма (для покадровой визуализации)
        // Первый шаг — просто исходный отрезок
        const steps = [points.map(p => ({ x: p.x, y: p.y }))];

        // Начальное значение вертикального смещения (амплитуда)
        let disp = initialDisp;

        // Основной цикл — количество итераций алгоритма
        for (let k = 0; k < iters; k++) {
            // Для каждой пары соседних точек вычисляем середину и добавляем к ней случайное смещение по вертикали
            const newPoints = [];
            for (let i = 0; i < points.length - 1; i++) {
                const a = points[i];       // Текущая точка
                const b = points[i + 1];   // Следующая точка

                newPoints.push({ x: a.x, y: a.y }); // Сначала добавляем исходную точку

                // Находим координаты середины отрезка
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;

                // Определяем случайный знак смещения (-1..1)
                const sign = (rng() - 0.5) * 2;

                // Вычисляем вертикальное смещение середины
                const mdy = sign * disp;

                // Добавляем новую "серединную" точку с вертикальным отклонением
                newPoints.push({ x: mx, y: my + mdy });
            }

            // Добавляем последнюю точку (правая граница)
            newPoints.push(points[points.length - 1]);

            // Заменяем старый массив точек новым (обновляем профиль)
            points.length = 0;
            Array.prototype.push.apply(points, newPoints);

            // На каждом шаге уменьшаем величину смещения — чтобы горы становились плавнее. Возведение 2 в степень R
            disp *= Math.pow(2, -roughness);

            // Сохраняем текущее состояние профиля (для визуализации пошагового процесса)
            steps.push(points.map(p => ({ x: p.x, y: p.y })));
        }

        // Возвращаем массив всех шагов — от начального состояния до финального
        return steps;
    }



    // Convert points with normalized x to canvas coordinates
    function drawProfile(points, opts = { mode: 'polyline' }) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);


        // draw baseline grid (optional)
        // draw mountain fill
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);


        if (opts.mode === 'filled') {
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            // gradient
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, '#556b2f');
            g.addColorStop(0.6, '#6b8e23');
            g.addColorStop(1, '#a9a9a9');
            ctx.fillStyle = g;
            ctx.fill();


            // stroke on top
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else {
            ctx.strokeStyle = '#2b2b2b';
            ctx.lineWidth = 2;
            ctx.stroke();
        }


        // draw points small
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        for (const p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }


    // Map normalized x (0..width) to canvas pixel coords
    function mapPoints(stepPoints) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const mapped = stepPoints.map(p => ({ x: p.x, y: p.y }));
        return mapped;
    }


    // State
    let steps = [];
    let curStep = 0;
    let playId = null;


    function regenerate() {
        resize();
        const iters = parseInt(S.iters.value, 10);
        const disp = Number(S.disp.value);
        const rough = Number(S.rough.value);
        const leftH = Number(S.leftH.value);
        const rightH = Number(S.rightH.value);
        const seedVal = S.seed.value === '' ? null : parseInt(S.seed.value, 10);
        const width = canvas.clientWidth;


        // Generate steps where x positions are distributed along width
        const rawSteps = generateProfile({ width, iters, initialDisp: disp, roughness: rough, leftH, rightH, seed: seedVal });
        // Ensure x coordinates are set correctly (they already are: we used 0..width)
        steps = rawSteps.map(step => step.map(p => ({ x: p.x, y: p.y })));
        curStep = 0;
        render();
    }


    function render() {
        if (!steps || steps.length === 0) return;
        const mode = S.mode.value;
        const points = steps[curStep];
        drawProfile(points, { mode });
    }


    S.generate.addEventListener('click', () => { regenerate(); });
    S.next.addEventListener('click', () => { if (steps.length === 0) return; curStep = Math.min(steps.length - 1, curStep + 1); render(); });
    S.prev.addEventListener('click', () => { if (steps.length === 0) return; curStep = Math.max(0, curStep - 1); render(); });
    S.play.addEventListener('click', () => {
        if (playId) return;
        playId = setInterval(() => {
            if (steps.length === 0) return;
            curStep++;
            if (curStep >= steps.length) { curStep = steps.length - 1; clearInterval(playId); playId = null; }
            render();
        }, 600);
    });
    S.stop.addEventListener('click', () => { if (playId) { clearInterval(playId); playId = null; } });


    // initial
    regenerate();
})();