counter = 0;
Template.admin_dash_set.helpers({
    sets: function() {
        return Sets.find({}, { sort: { name: 1 } });
    },
    termset: function() {
        var id = this._id;
        var termArr = Sets.findOne(id).terms;
        var objArr = [];
        for (var i = 0; i < termArr.length; i++) {
            var name = Terms.findOne(termArr[i]).name;
            var type = Terms.findOne(termArr[i]).type;
            var termData = {
                name: name,
                id: termArr[i],
                type: type,
            }
            objArr.push(Terms.findOne(termArr[i]));
        }
        return objArr;
    },
    counter: function() {
        counter++;
        return counter;
    }
})
Template.admin_dash_set.helpers({
    editCard: function() {
        if (Session.get("editSet") === false) {
            return true;
        } else {
            return false;
        }
    }
})