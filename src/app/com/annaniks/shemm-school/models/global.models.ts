
export interface ServerResponse<T> {
    code: number;
    data?: T;
    message: string
}
export interface SalaryOperation {
    debitId: number
    comment: number
    money: number
    creditId: number
}
export interface BankAccount {
    accountId: string
    accounts: AccountPlans
    billingAccount: string
    currencies: Currency
    currencyId: number
    eServices: null
    id: number
    isMain: number
    name: string
    numberOfDocument: null
}
export interface EmployeeSalary {
    id: number
    employeeId: number
    year: number
    monthOfSalary: number
    notParticipateSalary: number
    participateSalary: number
    participateSalaryOfPart12: number
    noTaxableWorker: number
    incomeTax: number
    socialFee: number
    stampFee: number
    cleanSalary: number
    dirtySalary: number
    taxableWorker: number
    salaryGroupId: number
}
export interface SalaryEmployeeOperation {
    id: number
    debitId: number
    dPartnersId: number
    dAnaliticGroup2Id: number
    dAnaliticGroup1Id: number
    creditId: number
    cPartnersId: number
    cAnaliticGroup2Id: number
    cAnaliticGroup1Id: number
    money: number
    comment: string
    cPartnersIdisAah: number
    _pivot_salary_group_id: number
    _pivot_operation_id: number
}
export interface Salary {
    id: number
    creatorId: null
    date: null
    total: null
    taxableWorker: number
    noTaxableWorker: number
    notParticipateSalary: number
    employeSalary?: EmployeeSalary[]
    salaryOperation?: SalaryEmployeeOperation[]
}
export interface FilteredAddition {
    id: number
    establishmentId: null
    subdivisionId: null
    employeeId: number
    money: number
    isMain: number
    date: string
    additionId: number
}
export interface Benefits {
    id: number
    date: string
    documentNumber: number
    benefit: string
    employeeId: number
    employee: Employee
    analiticGroup1: AnalyticalGroup
    analiticGroup2: AnalyticalGroup
    comment: string
    middleSalary: Array<{
        id: number
        benefitId: number
        date: string
        money: number
        esteem: number
        comment: string
    }>

}
export interface Benefit {
    id: number
    date: string
    documentNumber: number
    benefit: string
    employeeId: number
    employee: Employee
    analiticGroup2Id: number
    analiticGroup1Id: number
    comment: string
    benefitMain: {
        id: number
        benefitId: number
        fromDate: string
        toDate: string
        expenseAccountId: number
        fromEmployer: number
        fromStateBudget: number
        middleDailyCoefficient: string,
        otherInformation: string
    }

    middleSalary: Array<{
        id: number
        benefitId: number
        date: string
        money: number
        esteem: number
        comment: string
    }>

}
export interface Vacations {
    id: number
    date: string
    documentNumber: number
    employeeId: number
    employee: Employee
    analiticGroup1: AnalyticalGroup
    analiticGroup2: AnalyticalGroup
    comment: string
    vacationMain: Array<{
        id: number
        vacationId: number
        fromDate: string
        toDate: string
        middleDailyCoefficient: string
        expenseAccountId: number
        transitAccountId: number
    }>


    vacationMiddleSalary: Array<{
        id: number
        vacationId: number
        date: string
        money: number
        esteem: number
        partOf12: number
        comment: string
    }>

    vacationMonths: Array<{
        id: number
        vacationId: number
        date: string
        index: number
        countOfDay: number
        money: number
    }>

}
export interface IMenu {
    icon: string;
    navText: string;
    routerLink: string;
}
export interface GenerateType {
    message: {
        maxColumValue: string

    }
}
export interface Items {
    label: string,
    modalName?: any,
    type?: number,
    path?: string,
    longTitle?: string,
    isSmallModal?: boolean
}
export interface AvarageSalaryForBenefit {
    year: number
    monthOfSalary: number
    employeeId: number
    sumNotParticipateSalary: number
    sumParticipateSalary: number
    sumParticipateSalaryOfPart12: number
}
export interface ReceiveService {
    id: number
    currencyId: number
    currencyExchangeRate1: string | number
    currencyExchangeRate2: string | number
    previousDayExchangeRate: number
    partnersId: number
    providerAccountId: string
    advancePaymentAccountId: string
    outputMethod: string
    purchaseDocumentNumber: number
    purchaseDocumentDate: string
    comment: string
    purchaseTypeOfService: string
    calculationTypeAah: string
    includeAahInExpense: number
    formOfReflectionAah: string
    typicalOperation: string
    analiticGroup1: AnalyticalGroup
    analiticGroup2: AnalyticalGroup
    date: string
    documentNumber: number
}
export interface PositionModel {
    id: number
    name: string
    subdivisionId: number,
    methodOfSallaryCalculation: string
    subdivision: ShortModel
}
export interface EnterVaults {
    id: number
    accept: string
    accountant: string
    allow: string
    calculationStyleOfAah: string
    comment: string
    container: string
    date: string
    documentDate: string
    documentN: string
    documentOfTransport: string
    documentOfTransportDate: string
    includeAahInCost: number
    mediator: string
    partnersAccountId: number
    partnersId: number
    powerOfAttorney: string
    prepaidAccountId: number
    typeOfAcquisitionOfNa: string
    warehouseId: number
}

export interface ExitVaults {
    id: number
    documentNumber: number
    expenseAccountId: string
    hasRequested: string
    accountant: string
    allow: string
    comment: string
    container: string
    date: string
    mediator: string
    powerOfAttorney: string
    warehouseId: number

}
export interface EnterVaultExitProduct {
    id: number
    warehouseEntryOrderId: number
    materialValueId: number
    point: number
    count: number
    price: number
    money: number
    isAah: number
    accountsId: number
    classificationId: number
    classification: Classifier
    accounts: AccountPlans
    batch?: number
    purposeExpenseAccountId: number
    warehouseId: number
    warehouseSignificanceId: number
    exitSpecification: any
    materialValue: {
        id: number
        name: string
        measurementUnitId: number
        classificationId: number
        accountId: number
        wholesalePrice: number
        retailerPrice: number
        currencyId: number
        wholesalePriceCurrency: null
        characteristic: string
        barCode: string
        externalCode: string
        hcbCoefficient: string
        billingMethodId: number
        isAah: number
        salesRevenueAccountId: number
        retailRevenueAccountId: number
        salesExpenseAccountId: number
        materialValueGroupId: number
        warehouseSignificance: WarehouseAcquistion
        warehouseSignificanceId: number
    }
}
export interface EnterVault {
    id: number
    date: number
    warehouseId: number
    documentNumber: null
    partnersId: number
    name: string
    warehouseSignificanceId: number
    partnersAccountId: number
    prepaidAccountId: number
    analiticGroup2Id: number
    analiticGroup1Id: number
    documentN: string
    documentDate: string
    comment: string
    powerOfAttorney: string
    mediator: string
    container: string
    accountant: string
    allow: string
    accept: string
    documentOfTransport: string
    documentOfTransportDate: string
    typeOfAcquisitionOfNa: string
    calculationStyleOfAah: string
    includeAahInCost: number
    partners: Partners
    partnersAccount: AccountPlans
    warehouseEntryOrderProduct: EnterVaultExitProduct[]
    warehouseEntryOrderOperation: OperationModel[]
    warehouse: WareHouse
    analiticGroup2: AnalyticalGroup
    prepaidAccount: AccountPlans
    analiticGroup1: AnalyticalGroup
}
export interface ExitVault {
    id: number
    date: string
    warehouseId: number

    warehouseSignificanceId: number
    documentNumber: number
    expenseAccountId: string
    analiticGroup2Id: number
    analiticGroup1Id: number
    comment: string
    powerOfAttorney: string
    mediator: string
    container: string
    accountant: string
    allow: string
    hasRequested: string
    analiticGroup2: AnalyticalGroup
    analiticGroup1: AnalyticalGroup
    warehouseExitOrderOperation: OperationModel[],
    warehouse: WareHouse
    warehouseExitOrderProduct: EnterVaultExitProduct[]
    exitSpecification: any
}
export interface Addition {
    id: number
    name: string
    tabelId: number
    typeOfIncomeId: number
    typeOfVacationId: number
    expenseAccountId: number
    coefficient: string
    recalculation: number
    isIncome: number
    decliningIncome: number
    isTradeUnion: number
    isForTaxPurposesOnly: number
    isMandatoryPension: number
    byTheEmployerMandatoryPension: number
    participatesOnAccountOfActualHours: number
    typeOfVacation: ShortModel
    expenseAccount: ShortModel
    tabel: TimeCard
    typeOfIncome: ShortModel,
    methodOfSallaryCalculation: string
}
export interface SalaryEmployee {
    name: string
    employeId: number
    income: Object,
    isShow?: boolean,
    employeeVacations: Array<any>
    employeeBenefits: Array<any>

}
export interface Employee {
    id: number
    fullName: string
    firstName: string
    lastName: string
    subdivisionId: number
    tabelCounter: number
    otherInformation: {
        id: number
        employeeId: number
        bankNumber: string
        socialCardNumber: string
        documentTypeId: number
        passportNumber: string
        dueDate: string
        byWhom: string
        nationality: string
        anotherDocumentNumber: string
        phone: string
        phone2: string
        email: string
        language: string
        maritalStatus: string
        education: string
        service: string
        membersOfFamily: string
    }
    general: {
        id: number
        employeeId: number
        professionId: number
        gender: string
        birthdate: string
        contractId: null
        accountId: number
        dateOfAccept: string
        acceptedCommand: string
        releaseDate: string
        releaseCommand: string
    }
    addressies: {
        id: number
        employeeId: number
        placeOfRegistration: number
        state: string
        community: string
        city: string
        street: string
        sameResidence: number
        hhResidence: number
        hhState: string
        hhCommunity: string
        hhCity: string
        hhStreet: string
        country: string
        addressee1: string
        addressee2: string
        addressee3: string
        post: string
    }
    employeeAccounts: Array<{
        id: number
        accountOfEmployeeCalculationId: number
        employeeId: number
        percent: string
        type: string,
        isPercent: string,
        ///
        name: string

    }>
    employeeAddition: Array<{
        id: number
        employeeId: number
        additionId: number
        isMain: string
        money: string
        date: string
    }>

    employeePosition: Array<{
        id: number
        positionId: number
        employeeId: number
        startOfPosition: string
        endOfPosition: string
        methodOfSallaryCalculation: null
        rateSallary: "150000"
        additionId: number
        workingSchedule: Array<{ id: number, employeePositionId: number, day: string, hours: string }>
        positon: {
            id: number
            name: string
            subdivisionId: number
            methodOfSallaryCalculation: null
        }
    }>


}
export interface Employees {
    id: number
    firstName: string
    fullName: string
    lastName: string
    tabelCounter: number
    subdivisionId: number
    /////
    additions: any
    addressies: {
        id: number
        employeeId: number
        placeOfRegistration: number
        state: string
        community: string
        city: string
        street: string
        sameResidence: number
        hhResidence: number
        hhState: string
        hhCommunity: string
        hhCity: string
        hhStreet: string
        country: string
        addressee1: string
        addressee2: string
        addressee3: string
        post: string
    }

    general: {
        id: number
        employeeId: number
        professionId: number
        gender: string
        birthdate: string
        contractId: null
        accountId: number
        dateOfAccept: string
        acceptedCommand: string
        releaseDate: string
        releaseCommand: string
        stampFee: string
    }

    otherInformation: {
        id: number
        employeeId: number
        bankNumber: string
        socialCardNumber: string
        documentTypeId: number
        passportNumber: string
        dueDate: string
        byWhom: string
        nationality: string
        anotherDocumentNumber: string
        phone: string
        phone2: string
        email: string
        language: string
        maritalStatus: string
        education: string
        service: string
        membersOfFamily: string
    }

    employeeAccounts: Array<{
        id: number
        accountOfEmployeeCalculationId: number
        employeeId: number
        percent: string
        type: string
    }>

    employeeAddition: Array<{
        id: number
        employeeId: number
        additionId: number
        isMain: string
        money: string
    }>

    employeePosition: Array<{
        id: number
        positionId: number
        employeeId: number
        startOfPosition: string
        endOfPosition: string
    }>

}
export interface Subsection {
    id: number
    name: string
    code: number
    customerAccountId: number
    prepaidAccountReceivedId: number
    aahAccountId: number
    typesOfActionsId: number
    prepaidAccountReceived: AccountPlans
    customerAccount: AccountPlans
    aahAccount: AccountPlans

}
export interface Classifier {
    id: number
    name: string
    code: string
    type: string
}
export interface WarehouseAcquistion {
    id: number
    name: string
    expenseAccountId: number
    expenseAccount: AccountPlans
    partnerAccountId: number
    partnerAccount: AccountPlans
    prepaymentAccountId: number
    prepaymentAccount: AccountPlans
}
export interface Types {
    id: number
    name: string
    code: number
}
export interface ILoginModel {
    email: string;
    password: string;
}
export interface DataCount {
    count: number
}
export interface MeasurementUnits {
    id: number
    code: string
    unit: string
    abbreviation: string
}
export interface WarehouseConfig {
    accountAAH: number
    aahPercent: string
    aahNeraryalPercent: string
}
export interface AccountPlan {
    id: number
    name: string
    isAccumulatedAccount: string
    acumulatedAccountId: string
    offBalanceSheet: string
    accountingByPartners: string
    analyticalGroup1: string
    analyticalGroup2: string
    calculationsTypeId: string
    account: string
    currencies?: Currency[]
}
export interface MaterialValues {
    accountId: number
    barCode: string
    billingMethodId: number
    characteristic: string
    classificationId: number
    externalCode: string
    hcbCoefficient: string
    isAah: number
    materialValueGroupId: number
    measurementUnitId: number
    name: string
    retailRevenueAccountId: number
    salesExpenseAccountId: number
    retailerPrice: number
    salesRevenueAccountId: number
    wholesalePrice: number
    account: {
        id: number
        name: string
        isAccumulatedAccount: string
        acumulatedAccountId: string
        offBalanceSheet: string
        accountingByPartners: string
        analyticalGroup1: string
        analyticalGroup2: string
        calculationsTypeId: string
        account: string
    },

    billingMethod: {
        id: number
        name: string
        abbreviation: string
    }
    classification: {
        id: number
        code: string
        name: string
        type: string
    }
    materialValueGroup: {
        id: number
        code: number
        name: string
        materialValueGroupId: null
    }
    measurementUnit: {
        id: number
        code: string
        unit: string
        abbreviation: string
    }
    retailRevenue: {
        id: number
        name: string
        isAccumulatedAccount: string
        acumulatedAccountId: string
        offBalanceSheet: string
        accountingByPartners: string
        analyticalGroup1: string
        analyticalGroup2: string
        calculationsTypeId: string
        account: string
    }
    salesExpense: {
        id: number
        name: string
        isAccumulatedAccount: string
        acumulatedAccountId: string
        offBalanceSheet: string
        accountingByPartners: string
        analyticalGroup1: string
        analyticalGroup2: string
        calculationsTypeId: string
        account: string
    }
    salesRevenue: {
        id: number
        name: string
        isAccumulatedAccount: string
        acumulatedAccountId: string
        offBalanceSheet: string
        accountingByPartners: string
        analyticalGroup1: string
        analyticalGroup2: string
        calculationsTypeId: string
        account: string
    }
    id: number
}
export interface Classification {
    id: number
    code: string
    name: string
    type: string
}
export interface Services {
    code: string
    fullName: string
    accountId: string
    barCode: string
    classificationId: number
    isAah: number
    measurementUnitId: number
    name: string
    retailerPrice: number
    wholesalePrice: number
    account: {}
    classification: Classification
    measurementUnit: {
        id: number
        code: string
        unit: string
        abbreviation: string
    }
    id: number
}
export interface ShortModel {
    id: number
    name: string
    updatedAt?: string
    createdAt?: string
}
export interface Table {
    id: number
    name: string
    hours: string
    months: string
    year: string
}
export interface NameCodeModel {
    name: string,
    id: number
}
export interface Additions {
    id: number
    name: string
    expenseAccountId: number
    typeOfIncomeId: number
    typeOfVacationId: number
    coefficient: string
    byTheEmployerMandatoryPension: number
    decliningIncome: number
    isForTaxPurposesOnly: number
    isIncome: number
    isMandatoryPension: number
    isTradeUnion: number
    participatesOnAccountOfActualHours: number
    recalculation: number
    typeOfIncome?: NameCodeModel
    typeOfVacation?: NameCodeModel
    expenseAccount?: NameCodeModel
    methodOfSallaryCalculation?: string
}
export interface ModalDataModel {
    title: string,
    url: string,
    id?: number,
    array?: Array<any>,
    mainUrl?: string,
    type?: number
}
export interface TimeCard {
    id: number
    name: string
    hours: string
    months: string
    year: string
}
export interface Group {
    id: number
    accumulator: string
    name: string

}
export interface Partners {
    id: number
    name: string
    accountantPositionId: number
    anotherAdditionalInformation: string
    anotherCredentialsNumber: string
    anotherCredentialsDate: string
    anotherDeliveryTime: string
    anotherFullname: string
    contract: string
    certificateNumber: string
    dateContract: any
    email: string
    fullName: string
    groupId: number
    headPositionId: number
    hvhh: string
    phone: string
    legalAddress: string
    mainPurposeOfPayment: string
    passportNumber: string
    percentageOfSalesDiscount: string
    practicalAddress: string
}
export interface WareHouse {
    id: number
    name: string
    address: string
    code: number
    responsible: string
    warehouseSignificance: {
        id: number,
        name: string,
        expenseAccountId: number,
        partnerAccountId: number,
        prepaymentAccountId: number,
    }
}
export interface ProductTypeForGetOperation {
    materialValueId: number
    point: number
    count: number
    price: number
    money: number
    isAah: boolean
    accountsId: number
    classificationId: number
}
export interface Partner {
    id: number
    hvhh: string
    name: string
    fullName: string
    groupId: number
    headPositionId: number
    accountantPositionId: number
    aaHpayer: number
    legalAddress: string
    practicalAddress: string
    headAah: string
    accountantAah: string
    certificateNumber: string
    passportNumber: string
    mainPurposeOfPayment: string
    phone: string
    email: string
    contract: string
    dateContract: any
    percentageOfSalesDiscount: string
    anotherAdditionalInformation: string
    anotherDeliveryTime: string
    anotherFullname: string
    anotherCredentialsNumber: string
    anotherCredentialsDate: any
    billingAccounts: [{ id: number, name: string, bankAccount: string, currencyId: number, account: string, serialNumber: string, isMain: number, partnersId: number }]
    additionalAddressePartners: [{ id: number, name: string, bankAccount: string, account: string, serialNumber: string, isMain: number, partnersId: number }]
}
export interface DeletedFormArrayModel {
    id: number,
    isDeleted: boolean
}
export interface OperationModel {
    debitId: number
    dPartnersId: number
    dAnaliticGroup_2Id: number
    dAnaliticGroup_1Id: number
    creditId: number
    cPartnersId: number
    cPartnersIdisAah: number
    cAnaliticGroup_2Id: number
    cAnaliticGroup_1Id: number
    money: number
    comment: string
}
export interface AccountPositionModel {
    id: number,
    name: string
}
export interface HeadPositionModel {
    id: number,
    name: string
}
export interface Currency {
    name: string
    currency: string,
    id?: number
}
export interface AccountPlans {
    id?: number;
    name: string;
    accountingByPartners: number;
    acumulatedAccountId?: number;
    offBalanceSheet: number;
    calculationsTypeId: number;
    account: string;
    isAccumulatedAccount: number;
    calculationsType: { id: number, name: string };
    analyticalGroup1?: number;
    analyticalGroup2?: number
}
export interface TabItem {
    title: string
    key: string
    isValid: boolean
}
export interface WearAdvertisingServices {
    expenseAccount: number,
    incomeAccount: number,
    inventory: string,
    name: string,
}
export interface IMeasurementUnitPayload {
    id?: number;
    code: string;
    unit: string;
    abbreviation: string;
}

export interface IWarehouseDetail {
    id?: number;
    name: string;
    code: string;
    address: string;
    responsible: string;
    // warehouseSignificanceId: number
}

export interface ClassificationDetail {
    id?: number;
    name: string;
    code: number;
    type?: string;
}
export interface AnalyticalGroup {
    id: number
    code: number
    analiticGroup1Id: number
    analiticGroup2Id?: number
    isAccumulate: string | number
    name: string
}
export interface JsonObjectType {
    id?: string
    name: string
    code?: number
}
export interface MaterialValueGroupDetail {
    id?: number;
    code: number;
    name: string;
    materialValueGroupId?: number;
}
export interface Provisions {
    billingDate: string,
    calculateWorkOrderImmediately: boolean,
    degreeOfRounding: number,
    transitAccount: string,
    minSalary: string,
    minSalaryWithPension: string,
    minSalaryWithPensionStarted: string,
    averageDailyCoefficientVacation: string,
    averageNumberOfMonths: number,
    averageDailyCoefficientBenefit: number,
    averageDailyCoefficientMaternityBenefit: number,
    amountOfStampPayment: number,
    partnerAmountOfStampPayment: number,
    dateOfIntroduction: string,
    accountingOfPersonnelDocuments: boolean,
    taxfee: number
    socialTaxfee: number
}
export interface BillingMethodPayload {
    id?: number;
    name: string;
    abbreviation: string;
}

export interface MaterialValueDetail {
    id?: number;
    name: string;
    measurementUnitId: number;
    classificationId: number;
    accountId: number;
    wholesalePrice: number;
    retailerPrice: number;
    currencyId: number;
    wholesalePriceCurrency: number;
    characteristic: number;
    barCode: number;
    externalCode: number;
    hcbCoefficient: number;
    billingMethodId: number;
    isAah: number | boolean;
    salesRevenueAccountId: number;
    retailRevenueAccountId: number;
    salesExpenseAccountId: number;
    materialValueGroupId: number;
}

export interface ServicesDetail {
    id?: number;
    code: number;
    fullName: string;
    name: string;
    measurementUnitId: number;
    classificationId: number;
    accountId: number;
    wholesalePrice: number;
    retailerPrice: number;
    barCode: number;
    isAah: boolean;
    measurementUnit?: IMeasurementUnitPayload;
    classification?: ClassificationDetail;
    account?: any;
}

export interface CashRegisterPayload {
    id?: string;
    account?: object;
    code: number;
    name: string;
    accountId: number;
    isMain: boolean | number;
    dmoN: string;
    deoN: string;
    hdmRegisN: string;
    ip: string;
    port: string;
    password: string;
    hdmNonTaxable: string;
    hdmTaxable: string;
    hdmPrintType: string

}

export interface PriceOfServicesDetail {
    id?: number;
    startDate: string;
    endDate: string;
    servicesId: number;
    services?: any;
    type: string
}

export interface Formulas {
    id?: number,
    code: string,
    caption: string,
    expression: string
}

export interface StructuralSubdivisionPayload {
    id?: number;
    code: string;
    name: string;
    partnerId: number;
    expenseAccountId: number,
    expenseAccount?: Object,
    partners?: Object
}

export interface BankPayload {
    code: string;
    name: string;
    swift: string;
}

export interface BillingAccountInBanksPayload {
    billingAccount: string;
    name: string;
    currencyId: number;
    accountId: number;
    isMain: boolean;
    numberOfDocument: string;
    eServices: string
}

export interface HmxProfitTaxDetail {
    id?: number,
    code: string;
    name: string;
    yearPrice: string;
}
export interface HmxValueOfBalanceDetail {
    id?: number,
    code: string;
    date: string;
    valueBeginningOfYear: string;
}

export interface HmTypeDetail {
    id?: number,
    code: string;
    name: string;
    initialAccountId: number;
    staleAccountId: number;
    usefullServiceDuration: string;
    hmxProfitTaxId: number;
    parentId?: number;
}

export interface AbsencesPayload {
    employeeId: number;
    date: string;
}

export interface HoldsPayload {
    code: number;
    name: string;
    coefficient: number;
    reduceFromIncomeTaxMoney: boolean;
    reduceFromMandatoryFundPens: boolean;
    inTheMiddleOfVacation: string;
    accountId: number
}

export interface AssignEstablishmentPayload {
    additionId: number;
    subdivisionId: number;
    totalSalary: number;
    assignEstablishmentListOfEmployee: Array<AssignEstablishmentListOfEmployeePayload>

}


export interface AssignEstablishmentListOfEmployeePayload {
    establishmentId?: number;
    subdivisionId: number;
    employeeId: number;
    money: number;
    isMain: boolean
}

export interface ReplacementPayload {
    substituteId: number;
    replaceableId: number;
    date: string;
    hours: number,
    beAbsence:boolean
}

export interface SystemAdditionPayload {
    code: number,
    name: string,
    account: string | null,
    income_tax_withheld: boolean
}

export interface WarehouseSignificancePayload {
    name: string;
    expenseAccountId: number;
    partnerAccountId: number;
    prepaymentAccountId: number
}


export interface IOperationSignificance {
    id?: number,
    name: string,
    inflowAccountId: number,
    inflowAccount?: AccountPlans,
    leakageAccountId: number,
    leakageAccount?: AccountPlans,
    partnerAccountId: number,
    partnerAccount?: AccountPlans
}
