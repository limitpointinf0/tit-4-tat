module.exports = {


    friendlyName: 'View Instagrams of Others',
  
  
    description: 'Display "Instagram" page.',
  
  
    exits: {
  
        success: {
            viewTemplatePath: 'pages/publish/instagram/list-instagram'
        }
  
    },
  
  
    fn: async function () {

        var liked_url = await sails.models.userinstagramengagement.find({
            user: this.req.me.id,
            engagement: 'like',
        });
        liked_url = liked_url.map(item => item.url);

        var followed_url = await sails.models.userinstagramengagement.find({
            user: this.req.me.id,
            engagement: 'follow',
        });
        followed_url = followed_url.map(item => item.url);

        var commented_url = await sails.models.userinstagramengagement.find({
            user: this.req.me.id ,
            engagement: 'comment',
        });
        commented_url = commented_url.map(item => item.url);

        var diff_liked_url = await sails.models.instagram.find({
            owner: { '!=': this.req.me.id },
            url: { '!=': liked_url},
            engagement: 'like',
            active: true,
        })
        .sort('points DESC')
        .populate('owner')
        .limit(10);
        
        var diff_followed_url = await sails.models.instagram.find({
            owner: { '!=': this.req.me.id },
            url: { '!=': followed_url},
            engagement: 'follow',
            active: true,
        })
        .sort('points DESC')
        .populate('owner')
        .limit(10);

        var diff_commented_url = await sails.models.instagram.find({
            owner: { '!=': this.req.me.id },
            url: { '!=': commented_url},
            engagement: 'comment',
            active: true,
        })
        .sort('points DESC')
        .populate('owner')
        .limit(10);

        var instagrams = diff_liked_url.concat(diff_followed_url, diff_commented_url);

        // Respond with view.
        return {
            currentSection: 'publish-dashboard',
            instagrams: instagrams,
        };
    }
  
  
};