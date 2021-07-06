module.exports = {


    friendlyName: 'View Advertise Dashboard',
  
  
    description: 'Display "Advertise" page.',
  
  
    exits: {
  
        success: {
            viewTemplatePath: 'pages/advertise/advertise-dashboard'
        }
  
    },
  
  
    fn: async function () {
        return {
            currentSection: 'advertise-dashboard'
        };
    }
  
  
};