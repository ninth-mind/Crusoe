Meteor.subscribe("userData");

//use below to open materialize modal
Template.profile.onRendered(function(){
  $('ul.tabs').tabs();
  // $('.modal-trigger').leanModal();
});

Template.userMessages.events({
  'click #delete' : function(){
    Session.set('toDelete',this._id);
    $('#promptDelete').openModal();
  }
})
Template.promptDelete.events({
  'click #confirmDeletion' : function(){
    var messageId = Session.get('toDelete')
    $('#promptDelete').closeModal()
    Meteor.call('removeMessage',messageId, function(err, result){
      if(err){
        $('#error').openModal();
      } else {
        $('#confirmDelete').openModal();
      }
    })
  }
})

Template.profileView.helpers({
  taggedMessages: function(){
    var messages=[]
    var taggedIds = Meteor.user().tagged
    var keys = []

    if (taggedIds){
      taggedIds.forEach(function(tagId){
        var message = Messages.find({_id:tagId},{fields:{
        location: 0,
        latWeight1m: 0,
        lngWeight1m: 0,
        latWeight15m: 0,
        lngWeight15m: 0,
        latWeight1hr: 0,
        lngWeight1hr: 0,
        latWeight6hr: 0,
        lngWeight6hr: 0,
        latWeight12hr: 0,
        lngWeight12hr: 0,
        latWeight1day: 0,
        lngWeight1day: 0,
        latWeight3day: 0,
        lngWeight3day: 0,
        latWeight1wk: 0,
        lngWeight1wk: 0,
        latWeight1month: 0,
        lngWeight1month: 0}}).fetch()[0]
        messages.push(message)

        if (message.key){
          var key = [message._id, message.key]
          keys.push(key)
        }
      })
    }

    Meteor.call("getMedia", keys, function(err, result){
      if (err) {
        console.log(err)
      } else {
        messages.forEach(function(message){
          for (var i = 0; i<result.length; i++){
              if (result[i][0] === message._id){
                message.image = result[i][1]
                console.log(messages)

              }
          }
        })
        Session.set("taggedMessages", messages)
      }
    })


    return Session.get("taggedMessages")
  },

  userCreated: function(){
    var username = Meteor.user().username || Meteor.user().profile.name
    var messages = Messages.find({username:username},{fields:{
        location: 0,
        latWeight1m: 0,
        lngWeight1m: 0,
        latWeight15m: 0,
        lngWeight15m: 0,
        latWeight1hr: 0,
        lngWeight1hr: 0,
        latWeight6hr: 0,
        lngWeight6hr: 0,
        latWeight12hr: 0,
        lngWeight12hr: 0,
        latWeight1day: 0,
        lngWeight1day: 0,
        latWeight3day: 0,
        lngWeight3day: 0,
        latWeight1wk: 0,
        lngWeight1wk: 0,
        latWeight1month: 0,
        lngWeight1month: 0}}).fetch()
    var keys = []

    messages.forEach(function(message){
      if (message.key){
        var key = [message._id, message.key]
        keys.push(key)
      }
    })

    Meteor.call("getMedia", keys, function(err, result){
      if (err){
        console.log(err)
      } else {
        messages.forEach(function(message){
          for (var i = 0; i<result.length; i++){
            if (result[i][0] === message._id){
              message.image = result[i][1]
            }
          }
        })
        Session.set("userMessages", messages)
      }
    })
    return Session.get("userMessages")
  }
});

Template.writeMessage.events({
  "click .throw": function () {
  },

  "click .submit": function () {
    var longitude = Number(localStorage.getItem("userLong"));
    var latitude = Number(localStorage.getItem("userLat"));
    var location=[longitude,latitude];
    Meteor.submitMessage(location);
  },

  "click .takephoto": function() {
    $('input.media-upload').val('');

    MeteorCamera.getPicture({}, function (err, data) {
      if ( err ) {
        console.log(err);
        throw new Error;
      }

      Session.set("photo", data);
    })
  }
});
