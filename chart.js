function chart({ selector, data, styles }) {
    const canvas = document.querySelector(selector);
    const ctx = canvas.getContext('2d');
    canvas.height = canvas.parentElement.clientHeight;
    canvas.width = canvas.parentElement.clientWidth;

    if (data.length) draw()

    if (data.length)
        window.addEventListener('resize', () => {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            canvas.height = canvas.parentElement.clientHeight;
            canvas.width = canvas.parentElement.clientWidth;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw()
            ctx.restore();
        })

    function draw() {
        const minY = data.reduce((a, b) => a.y < b.y ? a : b).y - 10;
        const maxX = data.reduce((a, b) => a.x > b.x ? a : b).x + (data.length * 0.04);
        const maxY = data.reduce((a, b) => a.y > b.y ? a : b).y - minY + 20;

        ctx.scale(1, -1)

        ctx.translate(0, -maxY * canvas.height / maxY)

        if (styles.axis)
            drawAxisX(0)

        ctx.beginPath();

        drawLine()

        data.forEach(point => {
            if (styles.text)
                drawText(point, styles.text?.format(point.x, point.y));

            if (styles.dot)
                drawDot(point, styles.dot?.radius);
        });

        function drawLine() {
            ctx.save();

            data.forEach((point) => {
                ctx.lineWidth = 2

                ctx.shadowBlur = 10;
                ctx.shadowColor = styles.line?.shadowColor ? styles.line?.shadowColor : 'transparent';

                ctx.lineTo(percX(point.x), percY(point.y));
                ctx.strokeStyle = styles.line?.color;
            });

            ctx.stroke();
            ctx.restore();
        }

        function drawText(point, text) {
            ctx.save();

            ctx.translate(percX(point.x), percY(point.y));
            ctx.rotate(styles.text?.rotate * Math.PI / 2);
            ctx.scale(1, -1)

            ctx.font = styles.text?.size + "px " + styles.text?.font;
            ctx.fillStyle = styles.text?.color;

            ctx.fillText(text, 10, 0);

            ctx.restore();
        }

        function drawAxisX(pointY) {
            ctx.save();

            ctx.beginPath();
            ctx.lineTo(percX(0), percY(pointY));
            ctx.lineTo(percX(maxX), percY(pointY));
            ctx.strokeStyle = styles.axis?.color;
            ctx.lineWidth = styles.axis?.width;

            ctx.stroke();

            ctx.restore();
        }

        function drawDot(position, radius) {
            ctx.beginPath();
            ctx.arc(percX(position.x), percY(position.y), radius, 0, Math.PI * 2);

            ctx.shadowBlur = 10;
            ctx.shadowColor = styles.dot?.shadowColor ? styles.dot?.shadowColor : 'transparent';

            ctx.fillStyle = styles.dot?.color;
            ctx.fill();

            if (styles.dot?.stroke)
                ctx.stroke();

            ctx.restore();
        }

        function percX(x) {
            return x * canvas.width / maxX;
        }

        function percY(y) {
            return (y - minY) * canvas.height / maxY;
        }
    }
}