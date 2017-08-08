Template.admin_dash_set_new.events({
    'click .js-btn-term-select': function(e) {
        Session.set("newSet", true);
        var target = $(e.target);
        target.toggleClass("glyphicon-log-in glyphicon-log-out js-btn-term-select js-btn-term-deSelect");

        var children = $(".set-term-tags").children();
        var termArr = [];

        children.each(function() {
            var id = $(this).attr("id").split("-")[2];
            termArr.push(id);
        })
        setTimeout(function() {
            for (var i = 0; i < termArr.length; i++) {
                var checkbox = $("#set-term-new-" + termArr[i]);
                checkbox.prop("checked", "checked");
            }
        }, 250)
    },
    'click .js-btn-term-deSelect': function(e) {
        Session.set("newSet", false);
        var target = $(e.target);
        target.toggleClass("glyphicon-log-in glyphicon-log-out js-btn-term-select js-btn-term-deSelect");
    },
    'click .term-tag-close': function(e) {
        var parent = $(e.target).parent();
        var id = parent.attr("id").split("-")[2];
        $("#set-term-new-" + id).click();
        parent.remove();
    },
    'click .js-btn-term-save': function(e) {
        var name = $("#set-new-name").val();
        var children = $(".set-term-tags").children();
        var termArr = [];

        children.each(function() {
            var id = $(this).attr("id").split("-")[2];
            termArr.push(id);
        })
        console.log()
        if (name && termArr.length > 0) {

            var setObj = {
                meta: {
                    owner: Meteor.userId(),
                    added: new Date(),
                },
                name: name,
                terms: termArr,
            };
            Meteor.call("insertSet", setObj, function(err, res) {
                if (!err) {
                    toastr["success"]("Set " + setObj.name + " successfully added!");
                } else {
                    toastr["warning"]("Error while adding set: " + err);
                }
            });
            $(".js-btn-term-deSelect").click();
            $("#set-new-name").val("");
            $(".set-term-tags").children().remove();
            $('[data-target="#dashboard-set-list"]').click();
        } else if (children.length == 0) {
            toastr["warning"]("No terms present in the set.");
        } else {
            toastr["warning"]("Name field is missing.");
        }
    },
    'click .js-btn-term-cancel': function(e) {
        $(".js-btn-term-deSelect").click();
        $("#set-new-name").val("");
        $(".set-term-tags").children().remove();
    },
})

Template.admin_dash_set.events({
    'click .set-panel-terms': function(e) {
        $(".set-panel-selected").removeClass("set-panel-selected");
        Session.set("editSet", false);
        Session.set("newSet", false);
        return true;
    },
    'click .card-small-body': function(e) {
        e.stopPropagation();
    },
    'click .js-set-term-value-collapse': function(e) {
        var id = this._id;
        var target = $(e.target).attr("data-target");
        console.log(target);

        $(target).collapse('toggle');
    },
    'click .js-card-term-edit': function(e) {
        var id = this._id;
        var type = Terms.findOne(id).type;
        var card = $(e.target).closest(".card-body");

        console.log($(e.target))

        $(".card-small-body").not(card).addClass("card-disabled");

        if (Session.get("editId")) {
            card.removeClass("card-active");
            Session.set("editId", false);
            $(".card-active").removeClass("card-active");
            $(".card-disabled").removeClass("card-disabled");
            $(e.target).toggleClass("fa-cog fa-times");

        } else {
            Session.set("editId", id);
            if (type === "dropbox" || type === "checkbox" || type === "multiselect") {
                Session.set("multiSelect", id);
            }
            card.addClass("card-active");
            $(e.target).toggleClass("fa-cog fa-times");
        }
    },
    'click .js-card-term-delete': function(e) {

        var parent = $(e.target).closest(".panel-collapse");
        var child = $(e.target).closest(".card-small-body");
        var id = this._id;
        var parentId = parent.attr("id").split("-")[2];


        $("#set-term-new-" + id).prop("checked", false);
        child.animate({
            opacity: "0.1"
        }, 600, function() {
            Meteor.call("removeTermFromSet", parentId, id);
        })

    },
    'click .set-panel-delete': function(e) {
        var parent = $(e.target).closest(".panel-default");
        var id = this._id;
        parent.slideUp("slow", function() {
            Meteor.call("deleteSet", id, function(err, res) {
                if (!err) {
                    toastr["success"]("Set successfully deleted!");
                } else {
                    toastr["warning"]("Error while deleting set: " + err);
                }
            });
        })
    },
    'click .set-panel-edit': function(e) {

        $(e.target).toggleClass("fa-pencil-square-o fa-check-square-o");


        var id = this._id;

        var setName = Sets.findOne(id).name;


        if (!$("#set-panel-" + id).hasClass("in")) {
            $("#set-panel-terms-" + id).click();
        }

        var sessionId = Session.get("editSet");
        $(".new-set-term").prop("checked", false);

        var termArr = Sets.findOne(id).terms;


        if (id !== sessionId) {
            $("#set-panel-" + sessionId).removeClass("set-panel-selected");
            Session.set("editSet", false);
            sessionId = Session.get("editSet");
        }

        if (!sessionId) {

            Session.set("newSet", true);
            Session.set("editSet", id);
            $("#set-panel-" + id).addClass("set-panel-selected");

            setTimeout(function() {
                for (var i = 0; i < termArr.length; i++) {
                    var checkbox = $("#set-term-new-" + termArr[i]);
                    checkbox.prop("checked", "checked");
                }
            }, 250)

            $("[set-id='" + id + "']").css("display", "none");
            $("[input-holder='" + id + "']").append('<input type="text" name="set-newName" placeholder="' + setName + '" class="table-term-input set-name-input">');


        } else {
            Session.set("newSet", false);
            Session.set("editSet", false);
            $("#set-panel-" + id).removeClass("set-panel-selected");

            // update name
            var inputName = $('[name="set-newName"]').val();
            if (inputName) {
                console.log()
                Meteor.call("updateSetName", id, inputName, function(err, res) {
                    if (!err) {
                        toastr["success"]("Set " + inputName + " successfully updated!");
                    } else {
                        toastr["warning"]("Error while updating set: " + err);
                    }
                });
            }
            $("[set-id='" + id + "']").css("display", "block");
            $("[input-holder='" + id + "']").empty();
        }
    },
})