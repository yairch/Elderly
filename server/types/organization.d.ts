type OrganizationType = 'elderly' | 'volunteer' | 'both';

interface Organization {
    name: String;
    englishName: String;
    type: OrganizationType;
    phoneNumber: String;
};

module.exports = module
