module.exports = {


    friendlyName: 'Check Instagram Engagement',
  
  
    description: 'Check Instagram Engagement',
  
  
    inputs: {

        engagedPostId: {
            type: 'number',
        },

    },


    exits: {

        success: {
          outputDescription: 'Checked Instagram Engagement',
          outputExample: {}
        },
    
      },
  
  
    fn: async function (req, res) {
        // Get engaged item
        const engagedPost = await sails.models.instagram.findOne({
            id: this.req.body.engagedPostId,
        });

        if(!engagedPost) {
            throw 'Item has been deleted';
        }
        else {
            return engagedPost;
        }
  
    }
  
  
  };
  