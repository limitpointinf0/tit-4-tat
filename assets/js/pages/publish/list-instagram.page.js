parasails.registerPage('list-instagram-publish', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    instagrams: [],

    // Modals which aren't linkable:
    confirmDeleteInstagramModalOpen: false,

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    selectedInstagram: undefined,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.instagrams = this._marshalEntries(this.instagrams);
  },

  mounted: function() {
    this.$find('[data-toggle="tooltip"]').tooltip();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _marshalEntries: function(entries) {
      // Marshal provided array of data and return the modified version.
      return _.map(entries, (entry)=>{
        entry.confirm = false;
        return entry;
      });
    },

    _clearUploadInstagramModal: function() {
      // Close modal
      this.goto('/advertise/instagram');
      // Reset form data
      this.uploadInstagramFormData = {
        description: '',
        url: '',
        points: 0
      };
      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
    },

    clickAddButton: function() {
      // Open the modal.
      this.goto('/advertise/instagram/new');
    },

    closeUploadInstagramModal: function() {
      this._clearUploadInstagramModal();
    },

    handleParsingUploadInstagramForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.uploadInstagramFormData;

      if(!argins.url) {
        this.formErrors.url = true;
      }
      if(!argins.points) {
        this.formErrors.points = true;
      }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }
    },

    submittedUploadInstagramForm: function(result) {
      var newInstagram= _.extend(result, {});

      // Add the new thing to the list
      this.instagrams.unshift(newInstagram);

      // Close the modal.
      this._clearUploadInstagramModal();
    },

    clickDeleteInstagram: function(instagramId) {
      this.selectedInstagram = _.find(this.instagrams, {id: instagramId});

      // Open the modal.
      this.confirmDeleteInstagramModalOpen = true;
    },

    closeDeleteInstagramModal: function() {
      this.selectedInstagram = undefined;
      this.confirmDeleteInstagramModalOpen = false;
      this.cloudError = '';
    },

    handleParsingDeleteInstagramForm: function() {
      return {
        id: this.selectedInstagram.id
      };
    },

    submittedDeleteInstagramForm: function() {

      // Remove the thing from the list
      _.remove(this.instagrams, {id: this.selectedInstagram.id});

      // Close the modal.
      this.selectedInstagram = undefined;
      this.confirmDeleteInstagramModalOpen = false;
    },

    checkInstagramEngagement: async function(engagedPostId) {
      
    },

    clickInstagramUrl: function(url, engagedPostId) {    
      var param = "toolbar=no,scrollbars=1,width=600,height=600";
      //check instagram

      //make confirm button visible
      var requesting_confirm = this.instagrams.map( (ig) => {
        if (ig.id == engagedPostId){
          ig.confirm = true;
          return ig;
        }
        return ig;
      });

      this.instagrams = requesting_confirm;
      this.$forceUpdate();

      //show button
      window.open(url, 'igpopup', param);
    },

    clickInstagramUrlConfirm: async function(engagedPostId, points) {
      var self = this;
      const url_test = '/api/v1/publish/instagram/';
      const data = {engagedPostId: engagedPostId};
      const x_csrf_token = window.SAILS_LOCALS._csrf;

      var remove_url;
      var remove_engagement;
      await $.ajax({
        url: url_test,
        data : JSON.stringify(data),
        contentType: 'application/json',
        method : 'POST',
        headers: {
          'x-csrf-token': x_csrf_token 
        },
        success: function (data) {
          remove_url = data.url;
          remove_engagement = data.engagement;
        },
        error: function (data) { console.log(data); }
      });

      console.log(remove_url, remove_engagement);
      _.remove(this.instagrams, (instagram) => {
        var ex_remove_url = instagram.url == remove_url;
        var ex_remove_engagement = instagram.engagement == remove_engagement;
        return ex_remove_url && ex_remove_engagement;
      });

      this.me.pointsBalance += points;
      this.$forceUpdate();
    },
  }
});
