const lSystems = {
    "koch": {
        axiom: "F",
        rules: {"F": "F-F++F-F"},
        angle: 60, startX: 100, startY: 300, startAngle: 0, maxIterations: 6,
        description: "Кривая Коха\nАксиома: F\nПравило: F → F-F++F-F\nУгол: 60°"
    },
    "koch-snowflake": {
        axiom: "F++F++F",
        rules: {"F": "F-F++F-F"},
        angle: 60, startX: 400, startY: 300, startAngle: 0, maxIterations: 6,
        description: "Снежинка Коха\nАксиома: F++F++F\nПравило: F → F-F++F-F\nУгол: 60°"
    },
    "koch-island": {
        axiom: "F+F+F+F",
        rules: {"F": "F+F-F-FF+F+F-F"},
        angle: 90, startX: 400, startY: 300, startAngle: 0, maxIterations: 5,
        description: "Квадратный остров Коха\nАксиома: F+F+F+F\nПравило: F → F+F-F-FF+F+F-F\nУгол: 90°"
    },
    "sierpinski-carpet": {
        axiom: "FXF--FF--FF",
        rules: {"F": "FF", "X": "--FXF++FXF++FXF--"},
        angle: 60, startX: 400, startY: 300, startAngle: 0, maxIterations: 5,
        description: "Ковер Серпинского\nАксиома: FXF--FF--FF\nПравила: F → FF, X → --FXF++FXF++FXF--\nУгол: 60°"
    },
    "sierpinski-arrow": {
        axiom: "YF",
        rules: {"F": "F", "X": "YF+XF+Y", "Y": "XF-YF-X"},
        angle: 60, startX: 400, startY: 500, startAngle: 0, maxIterations: 7,
        description: "Наконечник Серпинского\nАксиома: YF\nПравила: X → YF+XF+Y, Y → XF-YF-X\nУгол: 60°"
    },
    "hilbert": {
        axiom: "X",
        rules: {"F": "F", "X": "-YF+XFX+FY-", "Y": "+XF-YFY-FX+"},
        angle: 90, startX: 100, startY: 100, startAngle: 0, maxIterations: 6,
        description: "Кривая Гильберта\nАксиома: X\nПравила: X → -YF+XFX+FY-, Y → +XF-YFY-FX+\nУгол: 90°"
    },
    "dragon": {
        axiom: "X",
        rules: {"F": "F", "X": "X+YF+", "Y": "-FX-Y"},
        angle: 90, startX: 300, startY: 300, startAngle: 0, maxIterations: 12,
        description: "Кривая дракона\nАксиома: X\nПравила: X → X+YF+, Y → -FX-Y\nУгол: 90°"
    },
    "gosper": {
        axiom: "XF",
        rules: {"F": "F", "X": "X+YF++YF-FX--FXFX-YF+", "Y": "-FX+YFYF++YF+FX--FX-Y"},
        angle: 60, startX: 300, startY: 300, startAngle: 0, maxIterations: 4,
        description: "Кривая Госпера\nАксиома: XF\nПравила: X → X+YF++YF-FX--FXFX-YF+, Y → -FX+YFYF++YF+FX--FX-Y\nУгол: 60°"
    },
    "tree1": {
        axiom: "F",
        rules: {"F": "FF-[-F+F+F]+[+F-F-F]"},
        angle: 22, startX: 400, startY: 550, startAngle: -90, maxIterations: 5,
        description: "Куст 1\nАксиома: F\nПравило: F → FF-[-F+F+F]+[+F-F-F]\nУгол: 22°"
    },
    "tree2": {
        axiom: "X",
        rules: {"F": "FF", "X": "F[+X]F[-X]+X"},
        angle: 20, startX: 400, startY: 550, startAngle: -90, maxIterations: 7,
        description: "Куст 2\nАксиома: X\nПравила: F → FF, X → F[+X]F[-X]+X\nУгол: 20°"
    },
    "tree3": {
        axiom: "X",
        rules: {"F": "FF", "X": "F-[[X]+X]+F[+FX]-X"},
        angle: 22.5, startX: 400, startY: 550, startAngle: -90, maxIterations: 6,
        description: "Куст 3\nАксиома: X\nПравила: F → FF, X → F-[[X]+X]+F[+FX]-X\nУгол: 22.5°"
    },
    "mosaic": {
        axiom: "X",
        rules: {"F": "F", "X": "[-F+F[Y]+F][+F-F[X]-F]", "Y": "[-F+F[Y]+F][+F-F-F]"},
        angle: 60, startX: 400, startY: 300, startAngle: 0, maxIterations: 4,
        description: "Шестиугольная мозаика\nАксиома: X\nПравила: X → [-F+F[Y]+F][+F-F[X]-F], Y → [-F+F[Y]+F][+F-F-F]\nУгол: 60°"
    },
    "fractal-tree": {
        axiom: "F",
        rules: {"F": "F[+F][-F]"},
        angle: 25, startX: 400, startY: 590, startAngle: -90, maxIterations: 6,
        description: "Фрактальное дерево\nАксиома: F\nПравило: F → F[+F][-F]\nУгол: 25°\nОсобенности: изменение толщины и цвета ветвей"
    }
};

const systemSelect = document.getElementById('system-select');
const iterationsInput = document.getElementById('iterations');
const iterationsValue = document.getElementById('iterations-value');
const angleInput = document.getElementById('angle');
const randomnessInput = document.getElementById('randomness');
const randomnessValue = document.getElementById('randomness-value');
const scaleInput = document.getElementById('scale');
const scaleValue = document.getElementById('scale-value');
const canvas = document.getElementById('fractal-canvas');
const ctx = canvas.getContext('2d');
const systemDescription = document.getElementById('system-description');

// Элементы для управления деревом
const treeControls = document.getElementById('tree-controls');
const branchShrinkInput = document.getElementById('branch-shrink');
const branchShrinkValue = document.getElementById('branch-shrink-value');
const lineWidthInput = document.getElementById('line-width');
const lineWidthValue = document.getElementById('line-width-value');
const branchRandomnessInput = document.getElementById('branch-randomness');
const branchRandomnessValue = document.getElementById('branch-randomness-value');
const colorTransitionInput = document.getElementById('color-transition');
const colorTransitionValue = document.getElementById('color-transition-value');
const leafSizeInput = document.getElementById('leaf-size');
const leafSizeValue = document.getElementById('leaf-size-value');
const randomTreeBtn = document.getElementById('random-tree-btn');

// Константы
const STEP_LENGTH = 20;
let currentTreeString = "";
let updateTimeout = null;

// Вспомогательные функции
const interpolateColor = (color1, color2, factor) => {
    return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));};

const rgbToString = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

const generateLSystem = (axiom, rules, iterations) => {
    let result = axiom;
    for (let i = 0; i < iterations; i++) {
        result = result.split('').map(char => rules[char] || char).join('');
        if (result.length > 100000) {
            console.warn(`Прервано на итерации ${i+1}`);
            return result.substring(0, 100000);
        }
    }
    return result;};

// Расчет границ
const calculateBounds = (systemString, angle, startX, startY, startAngle) => {
    let x = startX, y = startY, direction = startAngle;
    let minX = x, maxX = x, minY = y, maxY = y;
    const stack = [];
    
    for (const char of systemString) {
        switch (char) {
            case 'F': case 'G':
                x += Math.cos(direction * Math.PI / 180) * STEP_LENGTH;
                y += Math.sin(direction * Math.PI / 180) * STEP_LENGTH;
                minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                minY = Math.min(minY, y); maxY = Math.max(maxY, y);
                break;
            case '+': direction += angle; break;
            case '-': direction -= angle; break;
            case '[': stack.push({x, y, direction}); break;
            case ']': 
                if (stack.length > 0) ({x, y, direction} = stack.pop());
                break;
        }
    }
    return {minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY};
};

// Отрисовка фрактального дерева
const drawFractalTree = (systemString, angle, scale, startX, startY, startAngle) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const branchShrink = parseInt(branchShrinkInput.value) / 100;
    const baseLineWidth = parseInt(lineWidthInput.value);
    const branchRandomness = parseFloat(branchRandomnessInput.value);
    const colorTransition = parseInt(colorTransitionInput.value) / 100;
    const leafSize = parseInt(leafSizeInput.value);
    
    const trunkColor = [139, 69, 19];
    const leafColor = [34, 139, 34];
    
    // Автомасштабирование дерева
    const baseBounds = calculateBounds(systemString, angle, startX, startY, startAngle);
    const treeHeight = startY - baseBounds.minY;
    const baseScale = (canvas.height * 0.8) / treeHeight;
    const finalScale = baseScale * scale;
    const scaledLength = STEP_LENGTH * finalScale;
    
    let x = startX, y = startY, direction = startAngle;
    const stack = [];
    let depth = 0;
    const maxDepth = systemString.split('[').length - 1;
    const leafPositions = [];

    // Рисование ствола
    const trunkLength = scaledLength * 2;
    const trunkEndX = x + Math.cos(direction * Math.PI / 180) * trunkLength;
    const trunkEndY = y + Math.sin(direction * Math.PI / 180) * trunkLength;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(trunkEndX, trunkEndY);
    ctx.lineWidth = baseLineWidth;
    ctx.strokeStyle = rgbToString(interpolateColor(trunkColor, leafColor, colorTransition));
    ctx.stroke();
    
    x = trunkEndX; y = trunkEndY;

    // Рисование ветвей
    for (let i = 0; i < systemString.length; i++) {
        const char = systemString[i];
        
        switch (char) {
            case 'F':
                // Правильное вычисление толщины ветвей
                const currentLineWidth = Math.max(1, baseLineWidth * Math.pow(branchShrink, depth));
                
                const depthFactor = Math.min(1, depth / (maxDepth * 0.8));
                const totalColorFactor = Math.min(1, colorTransition + depthFactor * (1 - colorTransition));
                
                ctx.lineWidth = currentLineWidth;
                ctx.strokeStyle = rgbToString(interpolateColor(trunkColor, leafColor, totalColorFactor));
                
                const randomAngle = angle * (1 + (Math.random() - 0.5) * 2 * branchRandomness);
                const newX = x + Math.cos(direction * Math.PI / 180) * scaledLength;
                const newY = y + Math.sin(direction * Math.PI / 180) * scaledLength;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(newX, newY);
                ctx.stroke();
                
                if (i === systemString.length - 1 || systemString[i+1] === ']') {
                    leafPositions.push({x: newX, y: newY});
                }
                
                x = newX; y = newY;
                break;
                
            case '+': 
                direction += angle * (1 + (Math.random() - 0.5) * 2 * branchRandomness);
                break;
            case '-': 
                direction -= angle * (1 + (Math.random() - 0.5) * 2 * branchRandomness);
                break;
            case '[': 
                stack.push({x, y, direction, depth});
                depth++;
                break;
            case ']': 
                if (stack.length > 0) ({x, y, direction, depth} = stack.pop());
                break;
        }
    }
    
    // Рисование листьев
    if (leafSize > 0) {
        ctx.fillStyle = rgbToString(interpolateColor(trunkColor, leafColor, colorTransition));
        for (const pos of leafPositions) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, leafSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

// Отрисовка обычных L-систем
const drawLSystem = (systemString, angle, randomness, scale, startX, startY, startAngle) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (systemString.length > 100000) {
        ctx.fillStyle = '#e74c3c';
        ctx.font = '16px Arial';
        ctx.fillText('Слишком сложный фрактал', 50, 300);
        return;
    }
    
    const bounds = calculateBounds(systemString, angle, startX, startY, startAngle);
    const scaleX = (canvas.width * 0.8) / Math.max(bounds.width, 1);
    const scaleY = (canvas.height * 0.8) / Math.max(bounds.height, 1);
    const finalScale = Math.min(scaleX, scaleY) * scale;
    const scaledLength = STEP_LENGTH * finalScale;
    
    const offsetX = (canvas.width - bounds.width * finalScale) / 2 - bounds.minX * finalScale;
    const offsetY = (canvas.height - bounds.height * finalScale) / 2 - bounds.minY * finalScale;
    
    let x = startX * finalScale + offsetX;
    let y = startY * finalScale + offsetY;
    let direction = startAngle;
    const stack = [];
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    
    for (const char of systemString) {
        switch (char) {
            case 'F': case 'G':
                const stepLength = scaledLength * (1 + (Math.random() - 0.5) * 2 * randomness);
                x += Math.cos(direction * Math.PI / 180) * stepLength;
                y += Math.sin(direction * Math.PI / 180) * stepLength;
                ctx.lineTo(x, y);
                break;
            case '+': 
                direction += angle * (1 + (Math.random() - 0.5) * 2 * randomness);
                break;
            case '-': 
                direction -= angle * (1 + (Math.random() - 0.5) * 2 * randomness);
                break;
            case '[': stack.push({x, y, direction}); break;
            case ']': 
                if (stack.length > 0) {
                    ({x, y, direction} = stack.pop());
                    ctx.moveTo(x, y);
                }
                break;
        }
    }
    ctx.stroke();
};

// Обновление отображения
const updateDisplay = () => {
    if (updateTimeout) clearTimeout(updateTimeout);
    
    updateTimeout = setTimeout(() => {
        const currentSystem = lSystems[systemSelect.value];
        const iterations = Math.min(parseInt(iterationsInput.value), currentSystem.maxIterations || 6);
        const angle = parseInt(angleInput.value);
        const randomness = parseFloat(randomnessInput.value);
        const scale = parseInt(scaleInput.value) / 100;
        
        if (iterationsInput.value != iterations) {
            iterationsInput.value = iterations;
            iterationsValue.textContent = iterations;
        }
        
        systemDescription.textContent = currentSystem.description;
        
        // Для фрактального дерева всегда используем сохраненную строку, если она есть
        let systemString;
        if (systemSelect.value === 'fractal-tree') {
            // Генерируем новую строку только если изменились параметры структуры
            const structureParamsChanged = iterations !== parseInt(iterationsInput.dataset.lastValue) || 
                                        angle !== parseInt(angleInput.dataset.lastValue);
            
            if (structureParamsChanged || currentTreeString === "") {
                systemString = generateLSystem(currentSystem.axiom, currentSystem.rules, iterations);
                currentTreeString = systemString;
                iterationsInput.dataset.lastValue = iterations;
                angleInput.dataset.lastValue = angle;
            } else {
                systemString = currentTreeString;
            }
            
            drawFractalTree(systemString, angle, scale, currentSystem.startX, currentSystem.startY, currentSystem.startAngle);
        } else {
            systemString = generateLSystem(currentSystem.axiom, currentSystem.rules, iterations);
            drawLSystem(systemString, angle, randomness, scale, currentSystem.startX, currentSystem.startY, currentSystem.startAngle);
        }
    }, 50);
};

// Генерация случайного дерева
const generateRandomTree = () => {
    branchShrinkInput.value = Math.floor(Math.random() * 60) + 30;
    lineWidthInput.value = Math.floor(Math.random() * 15) + 3;
    branchRandomnessInput.value = (Math.random() * 0.7).toFixed(1);
    colorTransitionInput.value = Math.floor(Math.random() * 70) + 20;
    leafSizeInput.value = Math.floor(Math.random() * 6);
    angleInput.value = Math.floor(Math.random() * 30) + 15;
    iterationsInput.value = Math.floor(Math.random() * 4) + 4;
    
    // Обновление значений
    branchShrinkValue.textContent = branchShrinkInput.value + '%';
    lineWidthValue.textContent = lineWidthInput.value + 'px';
    branchRandomnessValue.textContent = branchRandomnessInput.value;
    colorTransitionValue.textContent = colorTransitionInput.value + '%';
    leafSizeValue.textContent = leafSizeInput.value + 'px';
    iterationsValue.textContent = iterationsInput.value;
    
    // Сбрасываем сохраненную строку, чтобы сгенерировать новое дерево
    currentTreeString = "";
    updateDisplay();
};

// Обработчики событий
systemSelect.addEventListener('change', function() {
    const currentSystem = lSystems[this.value];
    angleInput.value = currentSystem.angle;
    iterationsInput.max = currentSystem.maxIterations || 6;
    iterationsInput.value = Math.min(parseInt(iterationsInput.value), currentSystem.maxIterations || 6);
    iterationsValue.textContent = iterationsInput.value;
    
    treeControls.style.display = this.value === 'fractal-tree' ? 'flex' : 'none';
    if (this.value === 'fractal-tree') currentTreeString = "";
    updateDisplay();
});

// Назначение обработчиков для основных настроек
[iterationsInput, randomnessInput, scaleInput, angleInput].forEach(input => 
    input.addEventListener('input', function() {
        if (this === iterationsInput) iterationsValue.textContent = this.value;
        if (this === randomnessInput) randomnessValue.textContent = this.value;
        if (this === scaleInput) scaleValue.textContent = this.value + '%';
        updateDisplay();
    })
);

// Назначение обработчиков для настроек дерева
[branchShrinkInput, lineWidthInput, branchRandomnessInput, colorTransitionInput, leafSizeInput].forEach(input => 
    input.addEventListener('input', function() {
        // Обновляем отображаемые значения
        if (this === branchShrinkInput) branchShrinkValue.textContent = this.value + '%';
        if (this === lineWidthInput) lineWidthValue.textContent = this.value + 'px';
        if (this === branchRandomnessInput) branchRandomnessValue.textContent = this.value;
        if (this === colorTransitionInput) colorTransitionValue.textContent = this.value + '%';
        if (this === leafSizeInput) leafSizeValue.textContent = this.value + 'px';
        
        // Немедленная перерисовка дерева с новыми параметрами
        updateDisplay();
    })
);

randomTreeBtn.addEventListener('click', generateRandomTree);

// Инициализация
iterationsInput.max = lSystems[systemSelect.value].maxIterations || 6;
updateDisplay();