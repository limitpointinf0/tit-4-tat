parasails.registerPage('list-instagram', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    instagrams: [],

    // The "virtual" portion of the URL which is managed by this page script.
    virtualPageSlug: '',

    // Form data
    uploadInstagramFormData: {
      description: '',
      url: '',
      points: 1,
      type: 'post',
      engagement: 'like',
      active: true,
    },

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

  virtualPages: true,
  html5HistoryMode: 'history',
  virtualPagesRegExp: /^\/advertise\/instagram\/?([^\/]+)?/,

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
        points: 0,
        type: 'post',
        engagement: 'like',
        active: true
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

      if(!argins.description) {
        this.formErrors.description = true;
      }

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

      return argins;
    },

    submittedUploadInstagramForm: function(result) {
      var newInstagram= _.extend(result, {});

      debugger;

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
    clickInstagramUrl: function(url) {
      window.open(url, 'popup','width=600,height=600');
      return false;
    },
  }
});
