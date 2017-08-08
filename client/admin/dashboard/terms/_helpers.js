Template.admin_term_card.helpers({
    termsIndex: () => TermsIndex,
    terms: function() {
        return Terms.find({}, { sort: { "name": 1 } });
    },
    editOn: function() {
        var editId = Session.get("editId");
        var id = this._id;
        if (editId === id) {
            return true;
        } else {
            return false;
        }
    },
})


Template.admin_term_new.helpers({
    type: function() {
        return ["input", "textarea", "number", "dropbox", "single", "checkbox", "multiselect"];
    },
    multiSelect: function() {
        return Session.get("multiSelectNew");
    },
    edit: function() {
        if (Session.get("editId")) {
            return false;
        } else {
            return true;
        }
    }
})

Template.admin_term_edit.helpers({
    types: function() {
        var id = this._id;
        var type = Terms.findOne(id).type;
        var typeArr = ["input", "textarea", "number", "dropbox", "single", "checkbox", "multiselect"];
        var filterArr = [];
        for (var i = 0; i < typeArr.length; i++) {
            if (type !== typeArr[i]) {
                filterArr.push(typeArr[i]);
            }
        }
        return filterArr;
    },
    multiVal: function() {
        var id = this._id;
        var multiVal = Terms.findOne(id).values;
        if (multiVal) {
            console.log("values in mutival are: " + multiVal)
            return multiVal;
        } else {
            return false;
        }
    },
    multiSelect: function() {
        var multiSelect = Session.get("multiSelect");
        var id = this._id;
        var multiVal = Terms.findOne(id).type;

        if (multiSelect === id) {
            return true;
        } else {
            return false;
        }

    }
})

Template.admin_term_view.helpers({
    multiVal: function() {
        var id = this._id;
        var multiVal = Terms.findOne(id).values;
        if (multiVal) {
            return multiVal;
        } else {
            return false;
        }
    },
    expandVal: function() {
        var id = this._id;
        var expandId = Session.get("expandId");
        if (id === expandId) {
            return true;
        } else {
            return false;
        }
    },
    newSet: function() {
        return Session.get("newSet");
    }
})