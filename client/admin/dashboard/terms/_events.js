Template.admin_term_view.events({
    'change .new-set-term': function(e) {
        var id = this._id;
        var checkbox = $(e.target);
        var name = Terms.findOne(id).name;
        var setId = Session.get("editSet");

        if (checkbox.prop("checked")) {

            if (!setId || setId === undefined) {

                var html = '<span class="label label-default term-tag" id="term-tag-' + id + '">' + name + '&emsp;<i class="term-tag-close fa fa-close"></i></span>';
                $(".set-term-tags").append(html);

            } else {
                Sets.update({ _id: setId }, { $push: { terms: id } });
            }


            Sets.findOne(Session.get("editSet"))

        } else {

            if (!setId || setId === undefined) {
                $("#term-tag-" + id).remove();
            } else {
                Sets.update({ _id: setId }, { $pull: { terms: id } });
            }
        }
    },
})