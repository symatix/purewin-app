Template.admin_dashboard_body.events({
    'click .term-expand': function(e) {
        var trueId = this._id;
        var expandId = Session.get("expandId");
        if (trueId === expandId) {
            Session.set("expandId", false);
        } else {
            Session.set("expandId", this._id);
        }
    },
    'click .term-panel-new': function() {

        Session.set("newTerm", true);

        Session.set("editId", false);
        Session.set("multiSelect", false);
    },
    'click .term-edit': function(e) {
        var id = this._id;
        var type = Terms.findOne(id).type;

        $(".card-small-body").not("#card-small-body-" + id).addClass("card-disabled");

        Session.set("editId", id);
        if (type === "dropbox" || type === "checkbox" || type === "multiselect") {
            Session.set("multiSelect", id);
        }
    },
    'click .term-edit-save': function(e) {
        var id = this._id;
        var name = $("#table-term-name-" + id).val();
        var placeholder = $("#table-term-name-" + id).attr("placeholder");
        var type = $("#table-term-type-" + id).val();
        var values = [];


        if (!name) {
            name = placeholder;
        }

        $("input.table-term-val-input").each(function() {
            var val = $(this).val();
            if (val) {
                values.push(val);
            }
        });

        var termObj = {
            name: name,
            type: type,
            values: values,
        }
        Meteor.call("updateTerm", id, termObj, function(err, res) {
            if (!err) {
                toastr["success"]("Term " + name + " successfully updated!");
            } else {
                toastr["warrning"]("Error while updating term: " + err);
            }
        });
        Session.set("editId", false);
        Session.set("multiSelect", false);
        $(".card-active").removeClass("card-active");
        $(".card-disabled").removeClass("card-disabled");
        $(".fa-times").toggleClass("fa-times fa-cog");
    },
    'click .term-new-save': function(e) {
        var name = $("#form-term-name-new").val();
        var type = $("#form-term-type-new").val();
        var values = [];

        $("input.table-term-val-new-input").each(function() {
            var val = $(this).val();
            if (val) {
                values.push(val);
            }
        });
        if (name) {
            var termObj = {
                meta: {
                    owner: Meteor.userId(),
                    added: new Date(),
                },
                name: name,
                type: type,
                values: values,
            }
            Meteor.call("insertTerm", termObj, function(err, res) {
                if (!err) {
                    toastr["success"]("Term " + termObj.name + " successfully inserted!");
                } else {
                    toastr["warning"]("Error while inserting term: " + err);
                }
            });

            Session.set("multiSelectNew", false);
            var name = $("#form-term-name-new").val("");
            var type = $("#form-term-type-new").val("input");
            $(".term-panel-new").click();
        } else {
            toastr["warning"]("Name field missing.");
        }
    },
    'click .term-edit-cancel': function(e) {
        Session.set("editId", false);
        Session.set("multiSelect", false);
        $(".card-active").removeClass("card-active");
        $(".card-disabled").removeClass("card-disabled");
        $(".fa-times").toggleClass("fa-times fa-cog");
    },
    'click .term-new-cancel': function(e) {
        Session.set("multiSelectNew", false);
        var name = $("#form-term-name-new").val("");
        var type = $("#form-term-type-new").val("input");
    },

    'click .term-new-delete': function(e) {
        Session.set("multiSelectNew", false);
        var name = $("#form-term-name-new").val("");
        var type = $("#form-term-type-new").val("input");
        $(".term-panel-new").click();
        $(".card-active").removeClass("card-active");
        $(".card-disabled").removeClass("card-disabled");
    },

    'click .term-edit-delete': function(e) {
        var id = this._id;
        // this goes in to metod

        // get all the set ids that have this term and push them to array
        var sets = Sets.find({ "terms": { $elemMatch: { "$in": [id], "$exists": true } } }).fetch();
        var setIds = [];
        sets.forEach(function(element) {
            console.log(element);
            setIds.push(element._id);
        })
        console.log(sets, setIds);
        Meteor.call("deleteTerm", id, setIds, function(err, res) {
            if (!err) {
                toastr["success"]("Term " + name + " successfully deleted!");
            } else {
                toastr["warning"]("Error while deleting term: " + err);
            }
        });
    },
    'change select.table-term-input': function(e) {
        var id = this._id;

        if (!id) {
            id = true;
        }

        var val = $(e.target).val();

        if (val === "dropbox" || val === "checkbox" || val === "multiselect") {
            Session.set("multiSelect", id);
        } else {
            Session.set("multiSelect", false);
        }
    },
    'change select#form-term-type-new': function(e) {
        var val = $(e.target).val();
        if (val === "dropbox" || val === "checkbox" || val === "multiselect") {
            Session.set("multiSelectNew", true);
        } else {
            Session.set("multiSelectNew", false);
        }
    },
    'click .term-custom-value-add': function(e) {
        var id = this._id;
        var parent = e.target.parentNode;
        var lastChild = $(parent).children().last();
        var lastChildIndex = lastChild.attr("data-index");
        var newIndex = parseInt(lastChildIndex) + 1;
        if (id) {
            var html = '<label class="term-multi-values" data-index="' + newIndex + '" for="term-values-{{_id}}" style="white-space:nowrap;">Value ' + newIndex;
            html += '&emsp;<input class="table-term-val-input" type="text" value="" name="multival"></label>';
        } else {
            var html = '<label class="term-multi-values" data-index="' + newIndex + '" for="term-values-{{_id}}" style="white-space:nowrap;">Value ' + newIndex;
            html += '&emsp;<input class="table-term-val-new-input" type="text" value="" name="multival"></label>';
        }
        $(parent).append(html);
        console.log(newIndex);
    },
    'click .term-custom-value-sub': function(e) {
        var parent = e.target.parentNode;
        var lastChild = $(parent).children().last();
        var lastChildIndex = parseInt(lastChild.attr("data-index"));
        if (lastChildIndex > 2) {
            lastChild.remove();
        } else {

            var message = "At least 2 values <strong>must</strong> be present for this type.";
            var alert = "danger";
            var timeout = 3000;
            toastr["warning"]("At least 2 values must be present for this type.");

        }
    },
});