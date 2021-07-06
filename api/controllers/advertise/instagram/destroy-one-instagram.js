module.exports = {


    friendlyName: 'Destroy one instagram',
  
  
    description: 'Delete an instagram that will no longer be advertised.',
  
  
    inputs: {
  
      id: {
        description: 'The id of the thing to destroy',
        type: 'number',
        required: true
      },
  
    },
  
  
    exits: {
  
      notFound: {
        responseType: 'notFound'
      },
  
      forbidden: {
        responseType: 'forbidden'
      },
  
    },
  
  
    fn: async function ({id}) {
  
      var thingToDestroy = await sails.models.instagram.findOne({ id });
      // Ensure the thing still exists.
      if(!thingToDestroy) {
        throw 'notFound';
      }
      // Verify permissions.
      if(thingToDestroy.owner !== this.req.me.id) {
        throw 'forbidden';
      }
  
      // Archive the record.
      await sails.models.instagram.archiveOne({ id });
  
    }
  
  };
  