// set global template variable
_.templateSettings.variable = "template_data";

// jank pluralizer function
var pluralize = function(num) {
    if (num === 1) {
        return ["", "the"];
    } else {
        return ["s", "each"];
    }
};

// trigger tooltips
$('[data-toggle="tooltip"]').tooltip();
