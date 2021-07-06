module.exports = {


    friendlyName: 'View Publish Dashboard',
  
  
    description: 'Display "Publish" page.',
  
  
    exits: {
  
        success: {
            viewTemplatePath: 'pages/publish/publish-dashboard'
        }
  
    },
  
  
    fn: async function () {
        return {
            currentSection: 'publish-dashboard'
        };
    }
  
  
};