module.exports = {


    friendlyName: 'User Instagram Engagement',
  
  
    description: 'User Engagements with Instagram Items',
  
  
    inputs: {

        engagedPostId: {
            type: 'number',
        },

    },

    exits: {

        success: {
          outputDescription: 'The newly created `Engagement`.',
          outputExample: {}
        },
    
      },
  
  
    fn: async function (req, res) {
        // Get engaged item
        const user_id = this.req.me.id;
        const engagedPost = await sails.models.instagram.findOne({
            id: this.req.body.engagedPostId,
        });

        if(!engagedPost) {
            throw 'Item has been deleted';
        }
        else {

            var newEngagement = await sails.models.userinstagramengagement.create({
                url: engagedPost.url,
                type: engagedPost.type,
                engagement: engagedPost.engagement,
                points: engagedPost.points,
                user: user_id
            }).fetch();

            var rewardedUser = await sails.models.user.findOne({ id: user_id });
            var newBalance = rewardedUser.pointsBalance + engagedPost.points;
            await sails.models.user.update({ id: user_id })
            .set({
              pointsBalance: newBalance
            });

            var advertisingUser = await sails.models.user.findOne({ id: engagedPost.owner });
            var newBalance = advertisingUser.pointsBalance - engagedPost.points;
            await sails.models.user.update({ id: engagedPost.owner })
            .set({
              pointsBalance: newBalance
            });

            return newEngagement;
        }
  
    }
  
  
  };
  