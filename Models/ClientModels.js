const mongoose = require("mongoose")


const MemberSchema = new mongoose.Schema({
    MemberName: { type: String },
    MemberAge: { type: Number },
    MemberRelation: { type: String },
    MemberMaritalStatus: { type: String },
    MemberProfession: { type: String },
    MemberQualification: { type: String },
    MemberMoreDetails: { type: String },
});

const ClientSchema = new mongoose.Schema({
    PersnolDetails: {
        Name: { type: String, required: true },
        Religion: { type: String, required: true },
        Gender: { type: String, required: true },
        DateofBirth: { type: String, required: true },
        TimeofBirth: { type: String, required: true },
        PlaceofBirth: { type: String, required: true },
        MaritalStatus: { type: String, required: true },
        PartnerPreferences: { type: String, required: true },
        Complexion: { type: String, required: true },
        Hobbies: { type: String, required: true },
        DrinkingHabits: { type: String, required: true },
        EatingHabits: { type: String, required: true },
        Email: { type: String, required: true },
        Mobile: { type: String, required: true },
        Gotra: { type: String, required: true },
        Caste: { type: String, required: true },
        OpenforOtherCaste: { type: String, required: true },
        BelievesinPatri: { type: String, required: true },
        NativeTown: { type: String, required: true },
        OpenforOtherState: { type: String, required: true },
        NativeState: { type: String, required: true },
        Astrologically: { type: String, required: true },
        Visa: { type: String, required: true },
        WillingtoGoAbroad: { type: String, required: true },
        Weight: { type: String, required: true },
        Height: { type: String, required: true },
        SmokingHabits: { type: String, required: true },
        Disability: { type: String, required: true },
        ProfileComment: { type: String, required: true },
        NRIStatus: { type: String, required: true },
        SubCaste: { type: String, required: true },
        OpenforDivorce: { type: String, required: true },
        UploadBiodata: { type: String, required: true },
        SendBiodata: { type: String, required: true },
        IsPremium: { type: String, required: true }
    },
    EducationDetails: {
        School: { type: String, },
        PremiumCollege: { type: String, },
        HighestQualification: { type: String, },
        CompleteResidenceAddress: { type: String, },
        Residence: { type: String, },
        PersonalIncome: { type: String, },
        OccupationDetails: { type: String, },
        Occupation: { type: String, },
        occupationaddress: { type: String, },
        BusinessType: { type: String, }
    },
    familyDetails: {
        FatherName: { type: String },
        FatherOccupation: { type: String },
        FatherQualification: { type: String },
        FatherDateofBirthName: { type: String },
        FatherOccupationDetails: { type: String },
        FatherAlive: { type: String },
        MotherName: { type: String },
        MotherOccupation: { type: String },
        MotherDateofBirth: { type: String },
        MotherOccupationDetails: { type: String },
        MotherAlive: { type: String },
        FamilyType: { type: String },
        FamilyBusinessDetail: { type: String },
        FamilyAnnualIncome: { type: String },
        VehicleDetails: { type: String },
        OtherFamilyDetails: { type: String },
        MarriageBudget: { type: String },
        AddMembers: [MemberSchema]
    },
    ContactDetails: {
        HouseStatus: { type: String },
        ResidingCountry: { type: String },
        ResidentialState: { type: String },
        ResidentialCity: { type: String },
        NameoftheContactPerson: { type: String },
        RelationwithMember: { type: String },
        ResidentialAddress: { type: String },
        ResidencePhoneNo: { type: String },
        MotherNumber: { type: String },
        FatherNumber: { type: String },
        InstagramURL: { type: String },
        FacebookURL: { type: String },
        TwitterURL: { type: String }
    },
    Images: {
        ProfilePicture: { type: String },
        OtherPicture: { type: [String] }
    }
})


const Client = mongoose.model("Client", ClientSchema)

module.exports = Client