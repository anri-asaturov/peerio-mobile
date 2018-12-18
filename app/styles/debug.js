const border = (borderColor, borderWidth) => ({ borderColor, borderWidth: borderWidth || 1 });

const borders = input => {
    const r = {};
    input.forEach(i => {
        r[i] = border(i);
    });
    return r;
};

export default {
    border: borders(['red', 'green', 'blue', 'yellow'])
};
