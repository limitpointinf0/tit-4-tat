module.exports = {


    friendlyName: 'View Instagrams',
  
  
    description: 'Display "Instagram" page.',
  
  
    exits: {
  
        success: {
            viewTemplatePath: 'pages/advertise/instagram/list-instagram'
        }
  
    },
  
  
    fn: async function () {

        var instagrams = await sails.models.instagram.find({
            owner: this.req.me.id
        }).populate('owner'); 

        // Respond with view.
        return {
            currentSection: 'advertise-dashboard',
            instagrams: instagrams,
        };
    }
  
  
};