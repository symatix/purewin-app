Terms = new Mongo.Collection("terms");
Sets = new Mongo.Collection("sets");

Graphs = new Mongo.Collection("graphs");


GraphThumbs = new FilesCollection({
  collectionName: 'GraphThumbs',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

// enable this after accounts are configured
/*
GraphThumbs.allow({
    insert:function(userId, doc){
        if (userId){ // if logged in
            return true
        } else {
            consol.log("..i see you..");
            return false;  // if user not logged in - access denied
        }
    }
});
*/