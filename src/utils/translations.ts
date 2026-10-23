export type AppLanguage = 'en' | 'hi' | 'or';

export interface Translations {
  appName: string;
  appTag: string;
  languageName: string;
  
  // Header & Navigation
  login: string;
  signup: string;
  logout: string;
  switchAccount: string;
  myAccount: string;
  selectLanguage: string;
  upiSetup: string;
  alerts: string;
  soundOn: string;
  soundOff: string;
  navKhata: string;
  navNewBill: string;
  navReminders: string;
  navReports: string;

  // Home Screen
  totalDue: string;
  totalDueSubtitle: string;
  customers: string;
  overdueBannerText: (count: number) => string;
  sendReminderBtn: string;
  addUdhaarBtn: string;
  remindersBtn: string;
  searchPlaceholder: string;
  filterAll: string;
  filterOverdue: string;
  filterPending: string;
  filterCleared: string;
  customerListTitle: string;
  redWarningNote: string;
  daysPending: (days: number) => string;
  allCleared: string;
  totalPendingDue: string;
  clearedStatus: string;
  showQrBtn: string;
  sendReminderAction: string;
  whatsappAction: string;
  noCustomersYet: string;
  noCustomersSubtitle: string;
  addFirstCustomerBtn: string;
  noSearchResults: string;
  resetFilterBtn: string;

  // Add Entry Screen
  backBtn: string;
  newEntryTitle: string;
  gaveCreditTab: string;
  receivedCashTab: string;
  customerLabel: string;
  selectExistingCustomer: string;
  customerFullName: string;
  phoneLabel: string;
  addressLabel: string;
  amountLabel: string;
  quickAddLabel: string;
  clearAmount: string;
  itemsLabel: string;
  itemsHint: string;
  fastChipsLabel: string;
  dateLabel: string;
  sendWhatsAppCheckbox: string;
  sendWhatsAppHint: string;
  saveCreditBtn: string;
  saveCashBtn: string;
  entrySuccessTitle: string;
  entrySuccessDesc: (name: string, amount: string) => string;
  writeAnotherBillBtn: string;
  viewLedgerBtn: string;

  // Customer Ledger
  callCustomer: string;
  deleteCustomer: string;
  netDueBalance: string;
  payByUpi: (amount: string) => string;
  showLiveQr: string;
  ledgerHistory: string;
  entriesCount: (count: number) => string;
  deleteEntry: string;
  deleteCustomerConfirm: (name: string) => string;
  customerNotFound: string;
  backToKhataList: string;
  daysPendingBadge: (days: number) => string;
  allClearBadge: string;
  gaveCreditBtnShort: string;
  receivedCashBtnShort: string;
  noLedgerEntries: string;
  noLedgerEntriesSub: string;
  jamaModalTitle: string;
  jamaAmountLabel: string;
  fillFullDueBtn: (amount: string) => string;
  paymentNoteLabel: string;
  paymentNotePlaceholder: string;
  sendReceiptWhatsAppCheckbox: string;
  cancelAction: string;
  recordJamaAction: string;
  deleteCustomerModalTitle: string;
  deleteCustomerModalDesc: (name: string, count: number) => string;
  deleteEntryModalTitle: string;
  deleteEntryModalDesc: string;
  confirmDeleteYes: string;
  pleaseEnterValidAmount: string;
  whatsappLinkOpened: string;

  // Reminders Screen
  remindersTitle: string;
  remindersSubtitle: string;
  overdueSummary: (count: number, amount: string) => string;
  allOverdueCustomers: string;
  callNow: string;
  sendEnglishWhatsApp: string;
  noOverdueCustomers: string;
  noOverdueSub: string;

  // Reports Screen
  reportsTitle: string;
  reportsSubtitle: string;
  recoveredThisWeek: string;
  recoveredThisWeekSub: string;
  oldestDuesTitle: string;
  oldestDuesSubtitle: string;
  viewLedger: string;
  upiConfigTitle: string;
  upiConfigSub: string;
  changeUpiBtn: string;
  shopNameLabel: string;
  upiVpaLabel: string;
  shopPhoneLabel: string;
  privacyGuarantee: string;

  // Auth / Login Screen
  authHeaderTitle: string;
  authHeaderSubtitle: string;
  authIsolatedNotice: string;
  loginTab: string;
  signupTab: string;
  loginHeading: string;
  signupHeading: string;
  signupSubheading: string;
  yourFullName: string;
  yourShopName: string;
  emailLabel: string;
  emailAddress: string;
  mobileNumber10: string;
  securityPin: string;
  upiIdOptional: string;
  shopAddressOptional: string;
  loginSubmitBtn: string;
  signupSubmitBtn: string;
  alreadyRegistered: string;
  newShopkeeper: string;
  privacyFooterNote: string;

  // Account Deletion
  deleteStoreAccountBtn: string;
  confirmDeleteAccountTitle: string;
  confirmDeleteAccountDesc: (shopName: string) => string;
  confirmDeleteAccountYes: string;
}

export const translations: Record<AppLanguage, Translations> = {
  // ENGLISH
  en: {
    appName: 'UdhaarDesk',
    appTag: 'Kirana',
    languageName: 'English',

    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    switchAccount: 'Switch Store',
    myAccount: 'Store Profile',
    selectLanguage: 'Language',
    upiSetup: 'UPI',
    alerts: 'Alert',
    soundOn: 'Mute Sound',
    soundOff: 'Unmute Sound',
    navKhata: 'Ledger',
    navNewBill: 'New Bill',
    navReminders: 'Reminders',
    navReports: 'Reports',

    totalDue: 'TOTAL CREDIT DUE',
    totalDueSubtitle: 'Pending market receivables',
    customers: 'Customers',
    overdueBannerText: (count) => `${count} customers pending for 30+ days`,
    sendReminderBtn: 'Send Reminder',
    addUdhaarBtn: '+ Add Credit',
    remindersBtn: 'Reminders (30+)',
    searchPlaceholder: 'Search customer name or phone...',
    filterAll: 'All',
    filterOverdue: '30+ Days (Alert)',
    filterPending: 'Pending',
    filterCleared: 'Cleared (₹0)',
    customerListTitle: 'Customer Ledger List',
    redWarningNote: '30+ days = Red Alert',
    daysPending: (days) => `${days} days pending`,
    allCleared: 'All Cleared',
    totalPendingDue: 'Balance Due',
    clearedStatus: 'Cleared',
    showQrBtn: 'Show QR',
    sendReminderAction: 'Send Reminder',
    whatsappAction: 'WhatsApp',
    noCustomersYet: 'No customers in this store yet',
    noCustomersSubtitle: 'Add your first customer to start tracking credit and payments.',
    addFirstCustomerBtn: '+ Add First Customer',
    noSearchResults: 'No customer found matching search',
    resetFilterBtn: 'View All',

    backBtn: 'Back',
    newEntryTitle: 'Record Bill / Transaction',
    gaveCreditTab: '- Credit Given (Udhaar)',
    receivedCashTab: '+ Payment Received (Jama)',
    customerLabel: 'Customer',
    selectExistingCustomer: 'Select Existing Customer',
    customerFullName: 'Customer Full Name *',
    phoneLabel: 'WhatsApp / Phone *',
    addressLabel: 'Address / Locality',
    amountLabel: 'Amount (₹) *',
    quickAddLabel: 'Quick Add:',
    clearAmount: 'Clear',
    itemsLabel: 'Purchased Items Description',
    itemsHint: 'Included in WhatsApp message',
    fastChipsLabel: 'Quick Kirana Items (Tap to add):',
    dateLabel: 'Date',
    sendWhatsAppCheckbox: 'Send Bill to Customer via WhatsApp',
    sendWhatsAppHint: 'Sends English bill & UPI link immediately after save',
    saveCreditBtn: 'Save Credit Bill to Ledger',
    saveCashBtn: 'Record Payment Receipt',
    entrySuccessTitle: 'Ledger Updated Successfully! 🎉',
    entrySuccessDesc: (name, amount) => `₹${amount} recorded for ${name}`,
    writeAnotherBillBtn: '+ Add Another Bill',
    viewLedgerBtn: 'View Ledger',

    callCustomer: 'Call',
    deleteCustomer: 'Delete Customer',
    netDueBalance: 'Total Outstanding Due',
    payByUpi: (amount) => `Pay via UPI (${amount})`,
    showLiveQr: 'Show Store Live QR Code',
    ledgerHistory: 'Ledger Transaction History',
    entriesCount: (count) => `${count} entries`,
    deleteEntry: 'Delete entry',
    deleteCustomerConfirm: (name) => `Are you sure you want to delete ${name}'s ledger?`,
    customerNotFound: 'Customer not found or deleted.',
    backToKhataList: 'Back to Khata List',
    daysPendingBadge: (days) => `${days} Days Pending`,
    allClearBadge: 'All Cleared (₹0)',
    gaveCreditBtnShort: 'Gave Credit (-)',
    receivedCashBtnShort: 'Received Payment (+)',
    noLedgerEntries: 'No transactions recorded yet',
    noLedgerEntriesSub: 'Tap the buttons above to record a new credit or payment',
    jamaModalTitle: 'Payment Received (Jama)',
    jamaAmountLabel: 'Payment Amount (₹)',
    fillFullDueBtn: (amount) => `Fill Full Pending Due (${amount})`,
    paymentNoteLabel: 'Notes / Payment Method',
    paymentNotePlaceholder: 'e.g. Cash / PhonePe / GPay',
    sendReceiptWhatsAppCheckbox: 'Send Receipt to Customer on WhatsApp',
    cancelAction: 'Cancel',
    recordJamaAction: 'Save Payment',
    deleteCustomerModalTitle: 'Delete Customer Ledger?',
    deleteCustomerModalDesc: (name, count) => `Are you sure you want to delete ${name}'s entire ledger and all ${count} records? This cannot be undone.`,
    deleteEntryModalTitle: 'Delete Ledger Entry?',
    deleteEntryModalDesc: 'Are you sure you want to delete this transaction record?',
    confirmDeleteYes: 'Yes, Delete',
    pleaseEnterValidAmount: 'Please enter a valid payment amount (₹)',
    whatsappLinkOpened: 'WhatsApp receipt link opened',

    remindersTitle: 'Payment Reminders (30+ Days)',
    remindersSubtitle: 'Send English payment reminders to customers pending over 30 days',
    overdueSummary: (count, amount) => `${count} customers have ${amount} overdue for 30+ days`,
    allOverdueCustomers: 'Overdue Customers List',
    callNow: 'Call',
    sendEnglishWhatsApp: 'Send WhatsApp Reminder (English)',
    noOverdueCustomers: 'No Overdue Customers! 👏',
    noOverdueSub: 'All customer payments are up to date within 30 days.',

    reportsTitle: 'Store Accounts & Credit Report',
    reportsSubtitle: 'Last 7 days recoveries and oldest outstanding credit',
    recoveredThisWeek: 'Recovered This Week',
    recoveredThisWeekSub: 'Cash & UPI payments received in the last 7 days',
    oldestDuesTitle: 'Oldest Unpaid Customer Dues',
    oldestDuesSubtitle: 'Ranked by longest pending days',
    viewLedger: 'View Ledger',
    upiConfigTitle: 'Store UPI Settings',
    upiConfigSub: 'UPI ID and merchant name used for payments',
    changeUpiBtn: 'Edit',
    shopNameLabel: 'Store Name:',
    upiVpaLabel: 'UPI VPA:',
    shopPhoneLabel: 'Phone:',
    privacyGuarantee: '100% Private Ledger: Only you have access to your store credit data.',

    authHeaderTitle: 'UdhaarDesk',
    authHeaderSubtitle: 'Digital Kirana Ledger • Real Shopkeeper Account',
    authIsolatedNotice: '100% Data Isolation • Strictly Private Storage',
    loginTab: 'Log In',
    signupTab: 'Sign Up',
    loginHeading: 'Log In to Your Store Account',
    signupHeading: 'Create Your Real Store Ledger',
    signupSubheading: 'Your credit and customer records will remain completely private to you.',
    yourFullName: 'Your Full Name *',
    yourShopName: 'Store Name *',
    emailLabel: 'Email',
    emailAddress: 'Email Address *',
    mobileNumber10: 'Mobile Number (10 Digits) *',
    securityPin: 'Security PIN / Password *',
    upiIdOptional: 'UPI ID (Optional - for instant payment links)',
    shopAddressOptional: 'Store Address (Optional)',
    loginSubmitBtn: 'Log In',
    signupSubmitBtn: 'Create Account & Start',
    alreadyRegistered: 'Already registered? Log In here',
    newShopkeeper: 'New store owner? Sign Up here',
    privacyFooterNote: '🔒 All customer messages sent via WhatsApp are automatically composed in English.',

    deleteStoreAccountBtn: 'Delete Store Account',
    confirmDeleteAccountTitle: 'Delete Entire Store Account?',
    confirmDeleteAccountDesc: (shopName) => `Are you sure you want to permanently delete "${shopName}" and all its customers, bills, and payment records? This action cannot be undone.`,
    confirmDeleteAccountYes: 'Yes, Delete My Account',
  },

  // HINDI (हिन्दी)
  hi: {
    appName: 'उधारडेस्क',
    appTag: 'किराना',
    languageName: 'हिन्दी',

    login: 'लॉग इन',
    signup: 'नया खाता',
    logout: 'लॉग आउट',
    switchAccount: 'दुकान बदलें',
    myAccount: 'दुकानदार प्रोफाइल',
    selectLanguage: 'भाषा',
    upiSetup: 'UPI',
    alerts: 'अलर्ट',
    soundOn: 'आवाज़ बंद करें',
    soundOff: 'आवाज़ चालू करें',
    navKhata: 'खाता',
    navNewBill: 'नया बिल',
    navReminders: 'तकाज़ा',
    navReports: 'हिसाब',

    totalDue: 'कुल उधार बाकी (TOTAL DUE)',
    totalDueSubtitle: 'मार्केट में फंसा दुकान का पैसा',
    customers: 'ग्राहक',
    overdueBannerText: (count) => `${count} ग्राहक 30+ दिन से पेंडिंग हैं`,
    sendReminderBtn: 'तकाज़ा भेजें',
    addUdhaarBtn: '+ नया उधार',
    remindersBtn: 'तकाज़ा (30+)',
    searchPlaceholder: 'ग्राहक का नाम या फोन नंबर खोजें...',
    filterAll: 'सभी',
    filterOverdue: '30+ दिन (रेड अलर्ट)',
    filterPending: 'बाकी वाले',
    filterCleared: 'चुक्ता (₹0)',
    customerListTitle: 'ग्राहक खाता लिस्ट',
    redWarningNote: '30+ दिन = रेड अलर्ट',
    daysPending: (days) => `${days} दिन से बाकी`,
    allCleared: 'सब चुक्ता',
    totalPendingDue: 'कुल बाकी',
    clearedStatus: 'चुक्ता',
    showQrBtn: 'QR दिखाओ',
    sendReminderAction: 'तकाज़ा भेजो',
    whatsappAction: 'WhatsApp',
    noCustomersYet: 'इस दुकान में अभी कोई ग्राहक नहीं है',
    noCustomersSubtitle: 'अपनी दुकान का पहला ग्राहक जोड़ें और उधार/जमा लिखना शुरू करें।',
    addFirstCustomerBtn: '+ पहला ग्राहक जोड़ें',
    noSearchResults: 'कोई ग्राहक नहीं मिला',
    resetFilterBtn: 'सभी देखें',

    backBtn: 'वापस',
    newEntryTitle: 'नया बिल / एंट्री लिखें',
    gaveCreditTab: '- उधार दिया (Credit)',
    receivedCashTab: '+ जमा मिला (Payment)',
    customerLabel: 'ग्राहक (Customer)',
    selectExistingCustomer: 'पुराने ग्राहक चुनें',
    customerFullName: 'ग्राहक का पूरा नाम *',
    phoneLabel: 'व्हाट्सएप / फोन *',
    addressLabel: 'पता / मोहल्ला',
    amountLabel: 'रकम (Amount ₹) *',
    quickAddLabel: 'जोड़ें:',
    clearAmount: 'साफ करें',
    itemsLabel: 'सामान की लिस्ट (Items)',
    itemsHint: 'ग्राहक को अंग्रेजी मैसेज में दिखेगा',
    fastChipsLabel: 'किराना फास्ट चिप्स (क्लिक करके जोड़ें):',
    dateLabel: 'तारीख (Date)',
    sendWhatsAppCheckbox: 'ग्राहक को व्हाट्सएप पर बिल भेजें',
    sendWhatsAppHint: 'सेव होते ही ग्राहक के पास English बिल व UPI लिंक जाएगा',
    saveCreditBtn: 'खाते में उधार लिखें (Save Bill)',
    saveCashBtn: 'जमा रसीद दर्ज करें',
    entrySuccessTitle: 'खाता अपडेट हो गया! 🎉',
    entrySuccessDesc: (name, amount) => `${name} के खाते में ₹${amount} दर्ज हुआ।`,
    writeAnotherBillBtn: '+ एक और बिल लिखें',
    viewLedgerBtn: 'खाता देखें',

    callCustomer: 'कॉल करें',
    deleteCustomer: 'ग्राहक हटाएं',
    netDueBalance: 'कुल बाकी रकम (Net Due)',
    payByUpi: (amount) => `UPI से पेमेंट (${amount})`,
    showLiveQr: 'दुकान पर लाइव UPI QR दिखाओ',
    ledgerHistory: 'हिसाब तारीखवार (Ledger History)',
    entriesCount: (count) => `${count} एंट्रीज़`,
    deleteEntry: 'एंट्री डिलीट करें',
    deleteCustomerConfirm: (name) => `क्या आप सच में ${name} का खाता हटाना चाहते हैं?`,
    customerNotFound: 'ग्राहक नहीं मिला या हटा दिया गया।',
    backToKhataList: 'वापस खाता लिस्ट में जाएं',
    daysPendingBadge: (days) => `${days} दिन से बाकी`,
    allClearBadge: 'सब चुक्ता (₹0)',
    gaveCreditBtnShort: 'उधार दिया (-)',
    receivedCashBtnShort: 'जमा मिला (+)',
    noLedgerEntries: 'अभी तक कोई एंट्री नहीं है',
    noLedgerEntriesSub: 'नया उधार या जमा दर्ज करने के लिए ऊपर दिए गए बटन दबाएं',
    jamaModalTitle: 'जमा मिला (Payment Received)',
    jamaAmountLabel: 'जमा रकम (Amount ₹)',
    fillFullDueBtn: (amount) => `पूरा बाकी रकम भरें (${amount})`,
    paymentNoteLabel: 'नोट / माध्यम',
    paymentNotePlaceholder: 'उदा. नकद दिया / PhonePe / GPay',
    sendReceiptWhatsAppCheckbox: 'रसीद व्हाट्सएप पर भेजें',
    cancelAction: 'रद्द करें (Cancel)',
    recordJamaAction: 'जमा दर्ज करें',
    deleteCustomerModalTitle: 'ग्राहक खाता डिलीट करें?',
    deleteCustomerModalDesc: (name, count) => `क्या आप सच में ${name} का पूरा खाता और सभी ${count} हिसाब डिलीट करना चाहते हैं? यह वापस नहीं आएगा।`,
    deleteEntryModalTitle: 'एंट्री डिलीट करें?',
    deleteEntryModalDesc: 'क्या आप सच में यह हिसाब एंट्री डिलीट करना चाहते हैं?',
    confirmDeleteYes: 'हाँ, डिलीट करें',
    pleaseEnterValidAmount: 'कृपया सही पेमेंट रकम भरें (₹)',
    whatsappLinkOpened: 'व्हाट्सएप रसीद लिंक खुल गया',

    remindersTitle: '30+ दिन पेंडिंग तकाज़ा',
    remindersSubtitle: '30 दिनों से पुराने बाकीदारों को अंग्रेजी में व्हाट्सएप तकाज़ा भेजें',
    overdueSummary: (count, amount) => `${count} ग्राहकों का ₹${amount} 30+ दिनों से बाकी है`,
    allOverdueCustomers: 'रेड अलर्ट ग्राहक सूची',
    callNow: 'कॉल करें',
    sendEnglishWhatsApp: 'व्हाट्सएप तकाज़ा भेजें (English)',
    noOverdueCustomers: 'कोई रेड अलर्ट नहीं! 👏',
    noOverdueSub: 'सभी ग्राहकों का हिसाब 30 दिनों के भीतर सुरक्षित है।',

    reportsTitle: 'दुकान हिसाब व उधार रिपोर्ट',
    reportsSubtitle: 'पिछले 7 दिनों की वसूली और सबसे पुराने उधार की जानकारी',
    recoveredThisWeek: 'इस हफ्ते वसूली (Jama)',
    recoveredThisWeekSub: 'पिछले 7 दिनों में आई नकद व UPI वसूली',
    oldestDuesTitle: 'सबसे पुराने बाकीदार',
    oldestDuesSubtitle: 'सबसे ज्यादा दिनों से पेंडिंग क्रम में',
    viewLedger: 'खाता खोलें',
    upiConfigTitle: 'दुकान UPI सेटिंग',
    upiConfigSub: 'पेमेंट लेने के लिए UPI ID और नाम',
    changeUpiBtn: 'बदलें',
    shopNameLabel: 'दुकान नाम:',
    upiVpaLabel: 'UPI VPA:',
    shopPhoneLabel: 'फोन:',
    privacyGuarantee: '100% प्राइवेट खाता: सिर्फ आपको अपनी दुकान का डेटा दिखेगा।',

    authHeaderTitle: 'उधारडेस्क',
    authHeaderSubtitle: 'दुकान का डिजिटल खाता • असली दुकानदार लॉगिन व साइन अप',
    authIsolatedNotice: '100% सुरक्षित • किसी का डेटा दूसरों को नहीं दिखता',
    loginTab: 'लॉग इन',
    signupTab: 'नया खाता बनाएं',
    loginHeading: 'अपने खाते में लॉगिन करें',
    signupHeading: 'अपनी असली दुकान का खाता बनाएं',
    signupSubheading: 'आपका सारा उधार डेटा बिल्कुल गोपनीय और सुरक्षित रहेगा।',
    yourFullName: 'आपका पूरा नाम *',
    yourShopName: 'दुकान का नाम *',
    emailLabel: 'ईमेल',
    emailAddress: 'ईमेल पता *',
    mobileNumber10: 'मोबाइल नंबर (10 अंक) *',
    securityPin: 'सुरक्षा पिन / पासवर्ड *',
    upiIdOptional: 'UPI ID (वैकल्पिक - पेमेंट लिंक के लिए)',
    shopAddressOptional: 'दुकान का पता (वैकल्पिक)',
    loginSubmitBtn: 'लॉगिन करें',
    signupSubmitBtn: 'खाता बनाएं और शुरू करें',
    alreadyRegistered: 'पहले से खाता है? लॉगिन करें',
    newShopkeeper: 'नए दुकानदार हैं? साइन अप करें',
    privacyFooterNote: '🔒 ग्राहकों को भेजे जाने वाले सभी संदेश हमेशा English में तैयार होते हैं।',

    deleteStoreAccountBtn: 'दुकान का खाता हटाएं',
    confirmDeleteAccountTitle: 'दुकान का पूरा खाता डिलीट करें?',
    confirmDeleteAccountDesc: (shopName) => `क्या आप सच में अपनी दुकान "${shopName}" और उसके सभी ग्राहकों, बिलों और उधारी का डेटा हमेशा के लिए डिलीट करना चाहते हैं? यह वापस नहीं आ पाएगा।`,
    confirmDeleteAccountYes: 'हाँ, मेरा खाता डिलीट करें',
  },

  // ODIA (ଓଡ଼ିଆ)
  or: {
    appName: 'ଉଧାରଡେସ୍କ',
    appTag: 'କିରାନା',
    languageName: 'ଓଡ଼ିଆ',

    login: 'ଲଗ୍ ଇନ୍',
    signup: 'ନୂଆ ଖାତା',
    logout: 'ଲଗ୍ ଆଉଟ୍',
    switchAccount: 'ଦୋକାନ ବଦଳାନ୍ତୁ',
    myAccount: 'ଦୋକାନୀ ପ୍ରୋଫାଇଲ୍',
    selectLanguage: 'ଭାଷା',
    upiSetup: 'UPI',
    alerts: 'ଚେତାବନୀ',
    soundOn: 'ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ',
    soundOff: 'ଶବ୍ଦ ଚାଲୁ କରନ୍ତୁ',
    navKhata: 'ଖାତା',
    navNewBill: 'ନୂଆ ବିଲ୍',
    navReminders: 'ତଗାଦା',
    navReports: 'ହିସାବ',

    totalDue: 'ମୋଟ ବାକି ଟଙ୍କା (TOTAL DUE)',
    totalDueSubtitle: 'ବଜାରରେ ବାକି ଥିବା ଦୋକାନ ଟଙ୍କା',
    customers: 'ଗ୍ରାହକ',
    overdueBannerText: (count) => `${count} ଜଣ ଗ୍ରାହକ ୩୦+ ଦିନରୁ ବାକି ରଖିଛନ୍ତି`,
    sendReminderBtn: 'ତଗାଦା ପଠାନ୍ତୁ',
    addUdhaarBtn: '+ ନୂଆ ବାକି',
    remindersBtn: 'ତଗାଦା (୩୦+)',
    searchPlaceholder: 'ଗ୍ରାହକଙ୍କ ନାମ କିମ୍ବା ଫୋନ୍ ନମ୍ବର ଖୋଜନ୍ତୁ...',
    filterAll: 'ସମସ୍ତ',
    filterOverdue: '୩୦+ ଦିନ (ଚେତାବନୀ)',
    filterPending: 'ବାକି ଥିବା ଲୋକେ',
    filterCleared: 'ପରିଶୋଧ (₹୦)',
    customerListTitle: 'ଗ୍ରାହକ ଖାତା ତାଲିକା',
    redWarningNote: '୩୦+ ଦିନ = ଲାଲ୍ ଚେତାବନୀ',
    daysPending: (days) => `${days} ଦିନରୁ ବାକି`,
    allCleared: 'ସବୁ ପରିଶୋଧ',
    totalPendingDue: 'ମୋଟ ବାକି',
    clearedStatus: 'ପରିଶୋଧ',
    showQrBtn: 'QR ଦେଖାନ୍ତୁ',
    sendReminderAction: 'ତଗାଦା କରନ୍ତୁ',
    whatsappAction: 'WhatsApp',
    noCustomersYet: 'ଏହି ଦୋକାନରେ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଗ୍ରାହକ ନାହାନ୍ତି',
    noCustomersSubtitle: 'ନିଜ ଦୋକାନର ପ୍ରଥମ ଗ୍ରାହକ ଯୋଡ଼ନ୍ତୁ ଏବଂ ବାକି/ଜମା ହିସାବ ଆରମ୍ଭ କରନ୍ତୁ।',
    addFirstCustomerBtn: '+ ପ୍ରଥମ ଗ୍ରାହକ ଯୋଡ଼ନ୍ତୁ',
    noSearchResults: 'କୌଣସି ଗ୍ରାହକ ମିଳିଲେ ନାହିଁ',
    resetFilterBtn: 'ସମସ୍ତଙ୍କୁ ଦେଖନ୍ତୁ',

    backBtn: 'ଫେରନ୍ତୁ',
    newEntryTitle: 'ନୂଆ ବିଲ୍ / ଖାତା ଏଣ୍ଟ୍ରି ଲେଖନ୍ତୁ',
    gaveCreditTab: '- ବାକି ଦିଆଗଲା (Udhaar)',
    receivedCashTab: '+ ଜମା ମିଳିଲା (Payment)',
    customerLabel: 'ଗ୍ରାହକ (Customer)',
    selectExistingCustomer: 'ପୁରୁଣା ଗ୍ରାହକ ବାଛନ୍ତୁ',
    customerFullName: 'ଗ୍ରାହକଙ୍କ ପୂରା ନାମ *',
    phoneLabel: 'ହ୍ୱାଟସଆପ୍ / ଫୋନ୍ *',
    addressLabel: 'ଠିକଣା / ସାହି',
    amountLabel: 'ବାକି ଟଙ୍କା (Amount ₹) *',
    quickAddLabel: 'ଯୋଡ଼ନ୍ତୁ:',
    clearAmount: 'ସଫା କରନ୍ତୁ',
    itemsLabel: 'ସାମଗ୍ରୀ ତାଲିକା (Items)',
    itemsHint: 'ଗ୍ରାହକଙ୍କୁ ଇଂରାଜୀ ମେସେଜ୍‌ରେ ଦେଖାଯିବ',
    fastChipsLabel: 'କିରାନା ସାମଗ୍ରୀ (କ୍ଲିକ୍ କରି ଯୋଡ଼ନ୍ତୁ):',
    dateLabel: 'ତାରିଖ (Date)',
    sendWhatsAppCheckbox: 'ଗ୍ରାହକଙ୍କୁ ହ୍ୱାଟସଆପ୍‌ରେ ବିଲ୍ ପଠାନ୍ତୁ',
    sendWhatsAppHint: 'ସେଭ୍ ହେବା ମାତ୍ରେ ଗ୍ରାହକଙ୍କ ପାଖକୁ English ବିଲ୍ ଓ UPI ଲିଙ୍କ୍ ଯିବ',
    saveCreditBtn: 'ଖାତାରେ ବାକି ଲେଖନ୍ତୁ (Save Bill)',
    saveCashBtn: 'ଜମା ରସିଦ ଲେଖନ୍ତୁ',
    entrySuccessTitle: 'ଖାତା ଅପଡେଟ୍ ହୋଇଗଲା! 🎉',
    entrySuccessDesc: (name, amount) => `${name}ଙ୍କ ଖାତାରେ ₹${amount} ଲେଖାଗଲା।`,
    writeAnotherBillBtn: '+ ଆଉ ଏକ ବିଲ୍ ଲେଖନ୍ତୁ',
    viewLedgerBtn: 'ଖାତା ଦେଖନ୍ତୁ',

    callCustomer: 'କଲ୍ କରନ୍ତୁ',
    deleteCustomer: 'ଗ୍ରାହକଙ୍କୁ ହଟାନ୍ତୁ',
    netDueBalance: 'ମୋଟ ବାକି ଟଙ୍କା (Net Due)',
    payByUpi: (amount) => `UPI ମାଧ୍ୟମରେ ଦେୟ (${amount})`,
    showLiveQr: 'ଦୋକାନର ଲାଇଭ୍ UPI QR ଦେଖାନ୍ତୁ',
    ledgerHistory: 'ତାରିଖ ଅନୁସାରେ ହିସାବ (Ledger History)',
    entriesCount: (count) => `${count} ଏଣ୍ଟ୍ରି`,
    deleteEntry: 'ଏଣ୍ଟ୍ରି ହଟାନ୍ତୁ',
    deleteCustomerConfirm: (name) => `ଆପଣ ପ୍ରକୃତରେ ${name}ଙ୍କ ଖାତା ହଟାଇବାକୁ ଚାହାଁନ୍ତି କି?`,
    customerNotFound: 'ଗ୍ରାହକ ମିଳିଲେ ନାହିଁ କିମ୍ବା ହଟାଯାଇଛନ୍ତି।',
    backToKhataList: 'ଖାତା ତାଲିକାକୁ ଫେରନ୍ତୁ',
    daysPendingBadge: (days) => `${days} ଦିନରୁ ବାକି`,
    allClearBadge: 'ସବୁ ପରିଶୋଧ (₹୦)',
    gaveCreditBtnShort: 'ବାକି ଦିଆଗଲା (-)',
    receivedCashBtnShort: 'ଜମା ମିଳିଲା (+)',
    noLedgerEntries: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଏଣ୍ଟ୍ରି ଲେଖାଯାଇନାହିଁ',
    noLedgerEntriesSub: 'ନୂଆ ବାକି କିମ୍ବା ଜମା ଲେଖିବା ପାଇଁ ଉପର ବଟନ୍ ଦବାନ୍ତୁ',
    jamaModalTitle: 'ଜମା ମିଳିଲା (Payment Received)',
    jamaAmountLabel: 'ଜମା ଟଙ୍କା (Amount ₹)',
    fillFullDueBtn: (amount) => `ସମ୍ପୂର୍ଣ୍ଣ ବାକି ଟଙ୍କା ଲେଖନ୍ତୁ (${amount})`,
    paymentNoteLabel: 'ମାଧ୍ୟମ / ଟିପ୍ପଣୀ',
    paymentNotePlaceholder: 'ଯଥା: ନଗଦ / PhonePe / GPay',
    sendReceiptWhatsAppCheckbox: 'ହ୍ୱାଟସଆପ୍‌ରେ ରସିଦ ପଠାନ୍ତୁ',
    cancelAction: 'ବାତିଲ୍ କରନ୍ତୁ (Cancel)',
    recordJamaAction: 'ଜମା ଲେଖନ୍ତୁ',
    deleteCustomerModalTitle: 'ଗ୍ରାହକ ଖାତା ହଟାଇବେ କି?',
    deleteCustomerModalDesc: (name, count) => `ଆପଣ ପ୍ରକୃତରେ ${name}ଙ୍କ ସମସ୍ତ ${count} ହିସାବ ସହିତ ପୂରା ଖାତା ହଟାଇବାକୁ ଚାହାଁନ୍ତି କି? ଏହା ଆଉ ଫେରିବ ନାହିଁ।`,
    deleteEntryModalTitle: 'ଏଣ୍ଟ୍ରି ହଟାଇବେ କି?',
    deleteEntryModalDesc: 'ଆପଣ ପ୍ରକୃତରେ ଏହି ହିସାବ ଏଣ୍ଟ୍ରି ହଟାଇବାକୁ ଚାହାଁନ୍ତି କି?',
    confirmDeleteYes: 'ହଁ, ହଟାନ୍ତୁ',
    pleaseEnterValidAmount: 'ଦୟାକରି ସଠିକ୍ ଟଙ୍କା ଲେଖନ୍ତୁ (₹)',
    whatsappLinkOpened: 'ହ୍ୱାଟସଆପ୍ ରସିଦ ଲିଙ୍କ୍ ଖୋଲିଗଲା',

    remindersTitle: '୩୦+ ଦିନର ପୁରୁଣା ବାକି ତଗାଦା',
    remindersSubtitle: '୩୦ ଦିନରୁ ଅଧିକ ବାକି ରଖିଥିବା ଗ୍ରାହକଙ୍କୁ Englishରେ ହ୍ୱାଟସଆପ୍ ତଗାଦା ପଠାନ୍ତୁ',
    overdueSummary: (count, amount) => `${count} ଜଣ ଗ୍ରାହକଙ୍କ ଠାରୁ ₹${amount} ୩୦+ ଦିନରୁ ବାକି ରହିଛି`,
    allOverdueCustomers: 'ଲାଲ୍ ଚେତାବନୀ ଗ୍ରାହକ ତାଲିକା',
    callNow: 'କଲ୍ କରନ୍ତୁ',
    sendEnglishWhatsApp: 'ହ୍ୱାଟସଆପ୍ ତଗାଦା ପଠାନ୍ତୁ (English)',
    noOverdueCustomers: 'କୌଣସି ବାକି ଚେତାବନୀ ନାହିଁ! 👏',
    noOverdueSub: 'ସମସ୍ତ ଗ୍ରାହକଙ୍କ ହିସାବ ୩୦ ଦିନ ଭିତରେ ସୁରକ୍ଷିତ ଅଛି।',

    reportsTitle: 'ଦୋକାନ ହିସାବ ଓ ବାକି ରିପୋର୍ଟ',
    reportsSubtitle: 'ଗତ ୭ ଦିନର ଆଦାୟ ଏବଂ ସବୁଠାରୁ ପୁରୁଣା ବାକି ତଥ୍ୟ',
    recoveredThisWeek: 'ଏହି ସପ୍ତାହର ଆଦାୟ (Jama)',
    recoveredThisWeekSub: 'ଗତ ୭ ଦିନରେ ନଗଦ ଓ UPI ମାଧ୍ୟମରେ ଆସିଥିବା ଟଙ୍କା',
    oldestDuesTitle: 'ସବୁଠାରୁ ପୁରୁଣା ବାକିଦାର',
    oldestDuesSubtitle: 'ସର୍ବାଧିକ ଦିନରୁ ବାକି ଥିବା କ୍ରମରେ',
    viewLedger: 'ଖାତା ଦେଖନ୍ତୁ',
    upiConfigTitle: 'ଦୋକାନ UPI ସେଟିଂ',
    upiConfigSub: 'ପେମେଣ୍ଟ ନେବା ପାଇଁ UPI ID ଏବଂ ନାମ',
    changeUpiBtn: 'ବଦଳାନ୍ତୁ',
    shopNameLabel: 'ଦୋକାନ ନାମ:',
    upiVpaLabel: 'UPI VPA:',
    shopPhoneLabel: 'ଫୋନ୍:',
    privacyGuarantee: '୧୦୦% ବ୍ୟକ୍ତିଗତ ଖାତା: କେବଳ ଆପଣ ହିଁ ଆପଣଙ୍କ ଦୋକାନର ତଥ୍ୟ ଦେଖିପାରିବେ।',

    authHeaderTitle: 'ଉଧାରଡେସ୍କ',
    authHeaderSubtitle: 'ଦୋକାନର ଡିଜିଟାଲ୍ ଖାତା • ପ୍ରକୃତ ଦୋକାନୀ ଲଗ୍ ଇନ୍ ଓ ସାଇନ୍ ଅପ୍',
    authIsolatedNotice: '୧୦୦% ସୁରକ୍ଷିତ • ଅନ୍ୟ କାହାର ତଥ୍ୟ କାହାକୁ ଦେଖାଯିବ ନାହିଁ',
    loginTab: 'ଲଗ୍ ଇନ୍',
    signupTab: 'ନୂଆ ଖାତା ଖୋଲନ୍ତୁ',
    loginHeading: 'ନିଜ ଖାତାରେ ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
    signupHeading: 'ନିଜ ପ୍ରକୃତ ଦୋକାନର ଖାତା ଖୋଲନ୍ତୁ',
    signupSubheading: 'ଆପଣଙ୍କର ସମସ୍ତ ବାକି ତଥ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନୀୟ ଏବଂ ସୁରକ୍ଷିତ ରହିବ।',
    yourFullName: 'ଆପଣଙ୍କ ପୂରା ନାମ *',
    yourShopName: 'ଦୋକାନର ନାମ *',
    emailLabel: 'ଇମେଲ୍',
    emailAddress: 'ଇମେଲ୍ ଠିକଣା *',
    mobileNumber10: 'ମୋବାଇଲ୍ ନମ୍ବର (୧୦ ଅଙ୍କ) *',
    securityPin: 'ସୁରକ୍ଷା ପିନ୍ / ପାସୱାର୍ଡ *',
    upiIdOptional: 'UPI ID (ଇଚ୍ଛାଧୀନ - ପେମେଣ୍ଟ ଲିଙ୍କ୍ ପାଇଁ)',
    shopAddressOptional: 'ଦୋକାନର ଠିକଣା (ଇଚ୍ଛାଧୀନ)',
    loginSubmitBtn: 'ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
    signupSubmitBtn: 'ଖାତା ଖୋଲନ୍ତୁ ଏବଂ ଆରମ୍ଭ କରନ୍ତୁ',
    alreadyRegistered: 'ପୂର୍ବରୁ ଖାତା ଅଛି? ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
    newShopkeeper: 'ନୂଆ ଦୋକାନୀ? ସାଇନ୍ ଅପ୍ କରନ୍ତୁ',
    privacyFooterNote: '🔒 ଗ୍ରାହକଙ୍କ ପାଖକୁ ପଠାଯାଉଥିବା ସମସ୍ତ ମେସେଜ୍ ସର୍ବଦା Englishରେ ହିଁ ଯାଇଥାଏ।',

    deleteStoreAccountBtn: 'ଦୋକାନ ଖାତା ହଟାନ୍ତୁ',
    confirmDeleteAccountTitle: 'ପୂରା ଦୋକାନ ଖାତା ହଟାଇବେ କି?',
    confirmDeleteAccountDesc: (shopName) => `ଆପଣ ପ୍ରକୃତରେ "${shopName}" ଦୋକାନ ଏବଂ ଏହାର ସମସ୍ତ ଗ୍ରାହକ, ବିଲ୍ ଓ ବାକି ହିସାବ ସବୁଦିନ ପାଇଁ ହଟାଇବାକୁ ଚାହାଁନ୍ତି କି? ଏହା ଆଉ ଫେରିବ ନାହିଁ।`,
    confirmDeleteAccountYes: 'ହଁ, ମୋ ଖାତା ହଟାନ୍ତୁ',
  },
};
