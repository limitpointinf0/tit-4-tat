module.exports = {


    friendlyName: 'Add Instagram',
  
  
    description: 'Add one instagram.',
  
  
    inputs: {
  
        description: {
            type: 'string',
            description: 'name of listing'
        },
        url: {
            type: 'string',
            description: 'url of listing'
        },
        points: {
            type: 'number',
            description: 'number of points to use per like'
        },
        type: {
            type: 'string',
            description: 'type of listing'
        },
        engagement: {
            type: 'string',
            description: 'type of engagement'
        },
        active: {
            type: 'boolean',
            description: 'is actively being advertised'
        },
    },


    exits: {

        success: {
          outputDescription: 'The newly created `Instagram`.',
          outputExample: {}
        },
    
      },
  
  
    fn: async function (inputs) {

        console.log(inputs);
        
        // Check for an existing account for this user.
        var existingPost = await sails.models.instagram.findOne({ 
            owner: this.req.me.id,
            url: inputs.url
        });
  
        if(existingPost) {
            throw 'Already posted. Please try a different URL';
        }
        else {
            var newPost = await sails.models.instagram.create({
                description: inputs.description,
                url: inputs.url,
                points: inputs.points,
                type: inputs.type,
                engagement: inputs.engagement,
                active: inputs.active,
                owner: this.req.me.id
            }).fetch();

            return newPost;
        }
  
    }
  
  
  };
  