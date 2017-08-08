Template.admin_dash_workflow.helpers({
    graph: function() {
        return Graphs.find();
    },
    link: function() {
        var id = this._id;
        return GraphThumbs.findOne({ "name": id + ".png" }).link();
    },
})