
export const equalHeight = function (group: JQuery) {
    let tallest = 0;
    group.each(function () {
        const thisHeight = $(this).height() ?? 0;
        if (thisHeight > tallest) {
            tallest = thisHeight;
        }
    });

    group.height(tallest);
};