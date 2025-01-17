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
        OpenforOtherCaste: { type: String },
        BelievesinPatri: { type: String },
        NativeTown: { type: String, },
        NativeState: { type: String, },
        Astrologically: { type: String, required: true },
        Visa: { type: String },
        WillingtoGoAbroad: { type: String },
        Weight: { type: String },
        Height: { type: String, required: true },
        SmokingHabits: { type: String, required: true },
        Disability: { type: String, required: true },
        ProfileComment: { type: String },
        NRIStatus: { type: String },
        SubCaste: { type: String, },
        OpenforDivorce: { type: String },
        SendBiodata: { type: String },
        IsPremium: { type: String },
        EyeSight: { type: String, },
        ProfileSourcedFrom: { type: String, required: true },
        Personality: { type: String },
        MemberStatusChangeComment: { type: String },
    },
    EducationDetails: {
        School: { type: String, required: true },
        PremiumCollege: { type: String, },
        HighestQualification: { type: String, },
        CompleteResidenceAddress: { type: String, },
        Residence: { type: String, require: true },
        PersonalIncome: { type: String, required: true },
        OccupationDetails: { type: String, required: true },
        occupationaddress: { type: String, },
    },
    familyDetails: {
        FatherName: { type: String, required: true },
        FatherDateofBirthName: { type: String },
        FatherOccupation: { type: String, required: true },
        FatherQualification: { type: String, required: true },
        FatherOccupationAddress: { type: String, },
        FatherOccupationCompleteAddress: { type: String, },
        FatherOccupationDetails: { type: String, required: true },
        FatherMotherAnniversaryDate: { type: String },
        FatherFamilyDetails: { type: String },
        FatherBusinessDetails: { type: String },
        MotherName: { type: String, required: true },
        MotherDateofBirth: { type: String },
        MotherFamilyDetails: { type: String },
        MotherOccupation: { type: String, required: true },
        MotherOccupationDetails: { type: String },
        MotherQualificatation: { type: String, required: true },
        MotherOccupationAddress: { type: String },
        FamilyType: { type: String },
        VehicleDetails: { type: String },
        FamilyAnnualIncome: { type: String },
        ToMarriageBudget: { type: String },
        FamilyBusinessDetail: { type: String },
        OtherFamilyDetails: { type: String },
        AddMembers: [MemberSchema]
    },
    ContactDetails: {
        HouseStatus: { type: String, required: true },
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
    ProfilePicture: { type: String, required: true },
    FinalProfilePicture: { type: String },
    OtherPicture: { type: [String] },
    UploadBiodata: { type: String },
})


const Client = mongoose.model("Client", ClientSchema)

module.exports = Client



