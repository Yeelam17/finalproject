import type { CategoryId, Language } from "./types";

export const UI = {
  en: {
    nav: {
      explorer: "Explorer",
      report: "Learning report",
      codebook: "Codebook",
      aiUse: "AI use",
    },
    language: "繁體中文",
    eyebrow: "Taiwan and Mainland China bilingual food corpus",
    title: "Terminology in Translation",
    subtitle:
      "Compare Taiwan and Mainland Chinese food terminology through official wording, translation strategy, and regional difference.",
    searchLabel: "Search English, Chinese, or source record ID",
    searchPlaceholder: "Try: apple, 蘋果, or 091101x",
    filters: "Filters",
    filterCategory: "Translation strategy",
    filterChecked: "Human checked",
    filterEquivalence: "Chinese equivalents",
    filterOrientation: "Orientation",
    filterRegion: "Region",
    filterComparison: "Regional difference",
    all: "All",
    yes: "Yes",
    no: "No",
    single: "Single",
    multiple: "Multiple",
    taiwan: "Taiwan",
    mainland: "Mainland China",
    sameWording: "Same wording",
    scriptOnly: "Character variant only",
    partialOverlap: "Partial overlap",
    differentTerms: "Different terminology",
    unpaired: "No regional pair",
    clear: "Clear filters",
    results: "matching terms",
    resetSearch: "Reset view",
    reviewSample: "Review 50",
    strategy: "strategy",
    checked: "checked",
    terms: "terms",
    sourceAttribution:
      "Sources: NAER 樂詞網 and the China Food Composition Table bilingual food-name dataset. The full nutritional table is not republished.",
    footerNote:
      "A Translation Technology in the Age of AI final project. Regional comparison added 26 November 2026.",
    readReport: "Read the learning report",
    openCodebook: "Inspect the codebook",
    chartEmpty: "No terms match the current filters.",
    selectedTerm: "Selected term",
    clearSelection: "Clear selection",
    openSource: "Open cited source",
    category: "Category",
    confidence: "AI confidence",
    alternatives: "All Chinese equivalents",
    humanCheck: "Human checked",
    notChecked: "Not yet reviewed",
    qaSample: "Included in 50-term QA sample",
    exportFiltered: "Export filtered CSV",
    page: "Page",
    previous: "Previous",
    next: "Next",
    sort: "Sort",
    term: "Term",
    primaryTarget: "Principal Chinese rendering",
    orientation: "Orientation",
    equivalence: "Equivalence",
    detail: "Details",
    close: "Close",
    sourceData: "Source data",
    downloadCorpus: "Download clean CSV",
    downloadJson: "Download JSON",
    downloadSource: "Download original ODS",
    downloadMainland: "Download matched mainland names",
    totalRows: "Total terms",
    multiRows: "Multiple equivalents",
    checkedRows: "Human checked",
    strategies: "Strategies",
    qaTitle: "Review the 50-term sample",
    qaIntro:
      "Check each pair against its cited source and the codebook. Confirm the AI classification or mark it for correction. Decisions are stored in this browser and can be exported as a JSON audit file.",
    qaProgress: "reviewed",
    confirm: "Confirm classification",
    correction: "Needs correction",
    correctionNote: "What needs correction?",
    saveNote: "Save note",
    exportReview: "Export review JSON",
    resetReview: "Reset review",
    qaEmpty: "The QA sample has not loaded.",
    qaComplete:
      "All 50 sample entries have been reviewed. Export the JSON so the classifications can be updated in the published corpus.",
    reviewStatus: "Review status",
    pairedTerms: "Side-by-side wording",
    regionalPeers: "Matched regional wording",
    comparisonBasedOn: "Comparison uses Traditional-to-Simplified normalization",
  },
  zh: {
    nav: {
      explorer: "語料探索",
      report: "學習報告",
      codebook: "分類規準",
      aiUse: "AI 使用聲明",
    },
    language: "English",
    eyebrow: "臺灣與中國大陸食品雙語語料",
    title: "翻譯中的術語",
    subtitle:
      "透過官方用詞、翻譯策略與跨地差異，比較臺灣與中國大陸的食品術語。",
    searchLabel: "搜尋英文、中文或來源編號",
    searchPlaceholder: "例如：apple、蘋果或 091101x",
    filters: "篩選",
    filterCategory: "翻譯策略",
    filterChecked: "人工校對",
    filterEquivalence: "中文對等詞",
    filterOrientation: "翻譯導向",
    filterRegion: "地區",
    filterComparison: "跨地差異",
    all: "全部",
    yes: "是",
    no: "否",
    single: "單一",
    multiple: "多重",
    taiwan: "臺灣",
    mainland: "中國大陸",
    sameWording: "用詞相同",
    scriptOnly: "僅字形差異",
    partialOverlap: "部分重疊",
    differentTerms: "用詞不同",
    unpaired: "無跨地配對",
    clear: "清除篩選",
    results: "筆符合詞條",
    resetSearch: "重設檢視",
    reviewSample: "校對 50 筆",
    strategy: "策略",
    checked: "已校對",
    terms: "詞條",
    sourceAttribution:
      "資料來源：國家教育研究院樂詞網及《中國食物成分表》中英文食物名稱資料集。網站不重新發布完整營養成分表。",
    footerNote: "《人工智慧時代的翻譯科技》期末專題。跨地比較於 2026 年 11 月 26 日加入。",
    readReport: "閱讀學習報告",
    openCodebook: "查看分類規準",
    chartEmpty: "目前篩選條件沒有符合的詞條。",
    selectedTerm: "已選詞條",
    clearSelection: "清除選取",
    openSource: "開啟來源",
    category: "分類",
    confidence: "AI 信心值",
    alternatives: "所有中文對等詞",
    humanCheck: "人工校對",
    notChecked: "尚未校對",
    qaSample: "已納入 50 筆校對樣本",
    exportFiltered: "匯出目前篩選 CSV",
    page: "頁",
    previous: "上一頁",
    next: "下一頁",
    sort: "排序",
    term: "詞條",
    primaryTarget: "主要中文譯法",
    orientation: "翻譯導向",
    equivalence: "對等關係",
    detail: "詳細資料",
    close: "關閉",
    sourceData: "來源資料",
    downloadCorpus: "下載整理後 CSV",
    downloadJson: "下載 JSON",
    downloadSource: "下載原始 ODS",
    downloadMainland: "下載中國大陸配對名稱",
    totalRows: "詞條總數",
    multiRows: "多重中文對等詞",
    checkedRows: "已人工校對",
    strategies: "策略類別",
    qaTitle: "校對 50 筆隨機樣本",
    qaIntro:
      "請對照詞條來源與分類規準，逐筆確認 AI 分類，或標記需要修正。決定會儲存在此瀏覽器，並可匯出為 JSON 校對紀錄。",
    qaProgress: "已檢視",
    confirm: "確認分類",
    correction: "需要修正",
    correctionNote: "需要修正什麼？",
    saveNote: "儲存備註",
    exportReview: "匯出校對 JSON",
    resetReview: "重設校對",
    qaEmpty: "校對樣本尚未載入。",
    qaComplete: "50 筆樣本已全部檢視。請匯出 JSON，以便更新正式發布語料中的分類。",
    reviewStatus: "校對狀態",
    pairedTerms: "跨地並列用詞",
    regionalPeers: "跨地配對用詞",
    comparisonBasedOn: "比較先將臺灣繁體詞轉為簡體後再判斷用詞差異",
  },
} as const;

export type CodebookEntry = {
  id: CategoryId;
  definition: Record<Language, string>;
  rule: Record<Language, string>;
  source: string;
  positive: Record<Language, string>;
  negative: Record<Language, string>;
  boundary: Record<Language, string>;
};

export const CODEBOOK: CodebookEntry[] = [
  {
    id: "borrowing",
    definition: {
      en: "The Chinese designation reuses a recognisable source-language name or transfers its sound rather than creating a fully Chinese lexical equivalent.",
      zh: "中文譯名沿用可辨識的源語名稱，或以音近方式轉寫，未建立完全中文化的詞彙對等詞。",
    },
    rule: {
      en: "Choose this category when a single proper or taxonomic name is expressed through a Chinese name-like form and the source capitalization remains the strongest available signal. Acronyms translated by meaning do not qualify.",
      zh: "當單一專名或分類名以類似中文名稱的形式呈現，且源語大寫仍是最明確的可用線索時，選用此類。以意義翻譯的縮寫不屬於此類。",
    },
    source: "Vinay & Darbelnet (1958/1995), borrowing; Cabré (1999) on term formation",
    positive: {
      en: "Bordeaux → 波爾多. The target is a name-like transfer.",
      zh: "Bordeaux → 波爾多。中文保留名稱式轉寫。",
    },
    negative: {
      en: "AI → 人工智慧. The abbreviation is expanded semantically, so it is not borrowing.",
      zh: "AI → 人工智慧。縮寫依意義展開，因此不是借譯。",
    },
    boundary: {
      en: "Burgundy → 柏根迪葡萄酒 combines a name-like stem with a generic head. When both parts are visible, prefer hybrid rather than borrowing.",
      zh: "Burgundy → 柏根迪葡萄酒同時包含名稱式詞幹與類別中心詞；兩者皆可見時應優先歸為混用。",
    },
  },
  {
    id: "calque_literal",
    definition: {
      en: "The target follows the source term's observable structure, often mapping a compound or affix sequence element by element into a compositional Chinese term.",
      zh: "目標語依循源語術語可觀察的結構，通常把複合詞或詞綴成分逐項對應為組合式中文術語。",
    },
    rule: {
      en: "Choose this category when the English term is visibly multi-element or built from a productive scientific suffix, and the Chinese rendering preserves a comparable technical structure. Do not use it for an approximate paraphrase.",
      zh: "當英文詞條明顯含多個構詞成分，或由具生產力的科學詞綴構成，而中文保留相近的技術結構時選用。若只是近似意譯，則不使用。",
    },
    source: "Vinay & Darbelnet (1958/1995), calque and literal translation",
    positive: {
      en: "abdominal obesity → 腹部肥胖 preserves body-part plus condition structure.",
      zh: "abdominal obesity → 腹部肥胖保留「部位＋狀態」的結構。",
    },
    negative: {
      en: "abalone → 鮑魚 is a conventional lexical equivalent, not an observable morpheme calque.",
      zh: "abalone → 鮑魚是約定俗成的詞彙對等，並非可觀察的詞素仿譯。",
    },
    boundary: {
      en: "absolute alcohol → 無水酒精 is structurally close but changes 'absolute' into the chemical quality 'water-free'; mark it for review when literal structure is partial.",
      zh: "absolute alcohol → 無水酒精結構相近，但把 absolute 轉為化學性的「無水」；結構僅部分對應時應標記覆核。",
    },
  },
  {
    id: "semantic_equivalent",
    definition: {
      en: "The target communicates a similar concept through a lexical or conventional equivalent without preserving the source form's full visible structure.",
      zh: "目標語以詞彙或慣用對等表達相近概念，但不保留源語形式完整的可見結構。",
    },
    rule: {
      en: "Choose this category for ordinary single-term equivalents, functional labels, and lexical shifts where neither an overt explanation nor a retained source form is present.",
      zh: "一般單詞對等詞、功能名稱與詞彙轉換，若沒有明顯補充說明，也未保留源語形式，則選用此類。",
    },
    source: "Vinay & Darbelnet (1958/1995), equivalence and modulation",
    positive: {
      en: "AI → 人工智慧 translates the concept through a conventional Chinese expression.",
      zh: "AI → 人工智慧以慣用中文表達概念。",
    },
    negative: {
      en: "abdominal obesity → 腹部肥胖 retains a compositional structure and fits calque/literal.",
      zh: "abdominal obesity → 腹部肥胖保留組合結構，應歸入仿譯／直譯。",
    },
    boundary: {
      en: "strain → 菌株；品系；應變 has several domain-specific senses. Code the principal rendering, 菌株, and preserve the alternatives without treating them as separate entries.",
      zh: "strain → 菌株；品系；應變包含多個領域義項。分析主要譯法「菌株」，保留其餘對等詞，但不拆成獨立詞條。",
    },
  },
  {
    id: "explicitation",
    definition: {
      en: "The target adds a definition, category label, or contextual explanation that is not explicit in the source term.",
      zh: "目標語加入源語詞條未明示的定義、類別標籤或語境說明。",
    },
    rule: {
      en: "Choose this category when the translation adds explanatory material, especially a definition in braces or parentheses, or expands a compact term into a descriptive designation.",
      zh: "當譯文加入解釋性內容，尤其是大括號或括號中的定義，或把精簡詞條擴展為描述性名稱時選用。",
    },
    source: "Blum-Kulka (1986) on explicitation; Vinay & Darbelnet (1958/1995), amplification",
    positive: {
      en: "acesulphame → 安賽蜜 {一種無熱量的甜味劑} adds an explicit definition.",
      zh: "acesulphame → 安賽蜜 {一種無熱量的甜味劑}加入明確定義。",
    },
    negative: {
      en: "abdominal obesity → 腹部肥胖 adds no extra explanation.",
      zh: "abdominal obesity → 腹部肥胖沒有加入額外說明。",
    },
    boundary: {
      en: "adipophilin → 脂肪細胞分化蛋白 is more descriptive than its source form, but it does not contain a bracketed definition. Treat it as explicitation only when the expansion is judged explanatory rather than purely compositional.",
      zh: "adipophilin → 脂肪細胞分化蛋白比源語更具描述性，但沒有括號定義。只有在擴展屬於解釋而非純構詞對應時，才歸為顯化。",
    },
  },
  {
    id: "hybrid",
    definition: {
      en: "A rendering combines two or more procedures, such as a retained acronym, Latin or Greek form, phonetic stem, or proper-name element together with a translated Chinese head.",
      zh: "譯法同時使用兩種以上程序，例如保留縮寫、拉丁或希臘形式、音譯詞幹或專名成分，並加上中文類別中心詞。",
    },
    rule: {
      en: "Choose this category only when both procedures are visibly present in the principal rendering. A single procedure, however technical, remains in its own category.",
      zh: "只有當主要譯法明顯同時包含兩種程序時選用。即使技術性很高，只要只有一種程序，仍歸入該程序所屬類別。",
    },
    source: "Vinay & Darbelnet (1958/1995), combined procedures; Toury (2012) on translation norms",
    positive: {
      en: "acetyl CoA → 乙醯基輔酶A combines Chinese composition with the retained source abbreviation.",
      zh: "acetyl CoA → 乙醯基輔酶A結合中文構詞與保留的源語縮寫。",
    },
    negative: {
      en: "Bordeaux → 波爾多 uses a name transfer without a separately visible translated head.",
      zh: "Bordeaux → 波爾多只使用名稱轉寫，沒有另外可見的中文類別中心詞。",
    },
    boundary: {
      en: "Burgundy → 柏根迪葡萄酒 combines a phonetic name-like stem with the generic head 葡萄酒. The codebook assigns priority to hybrid when both elements are visible.",
      zh: "Burgundy → 柏根迪葡萄酒結合音譯式詞幹與中心詞「葡萄酒」。兩項均明顯時，依規準優先歸為混用。",
    },
  },
];

export const REPORT = {
  en: {
    eyebrow: "Learning report",
    title: "How two Chinese-language food communities name the same scientific world",
    standfirst:
      "This project compares Taiwan's official food-science terminology with matched bilingual food names from Mainland China. It asks which differences are only changes of Chinese script, which reuse part of the same term, and which reveal genuinely different terminology.",
    sections: [
      {
        title: "Origin",
        paragraphs: [
          "I began with Taiwan's NAER terminology because an official glossary creates a useful tension for translation analysis. A list looks neutral when English and Chinese sit side by side as if equivalence were already settled, yet every pair is the result of a choice. To make those choices comparative rather than merely descriptive, I added Mainland Chinese bilingual food names wherever an exact English name also appeared in NAER. The result is a corpus of 5,792 records: the full Taiwan inventory plus 101 matched Mainland rows covering 91 shared English concepts.",
          "The topic also connects food science to public language. Nutrition terms influence labels, clinical communication, product information, and science education. When an official database offers several Chinese equivalents for one English term, the apparent stability of terminology becomes an analytical question rather than a background fact.",
        ],
      },
      {
        title: "Background",
        paragraphs: [
          "The Taiwan source is the National Academy for Educational Research's 樂詞網, dataset 農學名詞－食品科學與營養學名詞. Its ODS contains 5,691 records with no missing cells in the ID, English term, Chinese term, and update-date fields. The Mainland source is the China Food Composition Table bilingual food-name dataset maintained in a GitHub repository. It supplies 101 food-name rows whose normalized English names exactly match a Taiwan record. English matching is intentionally strict: the project does not guess that two different food names refer to the same biological or commercial entity.",
          "Translation-studies work on direct and oblique procedures provides the starting vocabulary for the analysis. Vinay and Darbelnet describe borrowing, calque, literal translation, transposition, modulation, equivalence, and adaptation. Their categories are not a mechanical recipe, especially when source and target do not share a script. They remain useful as a comparative vocabulary. Explicitation research adds a further concern: translations may make implicit information explicit. To avoid forcing every classical procedure into a separate label, the codebook combines closely related procedures into five analysable strategies.",
          "Choosing institutional sources sets a boundary for the argument. These are not translations produced by one individual for one audience. They reflect committee review, textbook convention, food regulation, and long-term terminology standardization. The project can describe the resulting patterns, but it cannot reconstruct the full deliberation behind each Chinese term. Attribution is therefore both a legal and an analytical condition: the website reports on two institutional registers, not on freely authored parallel texts.",
        ],
      },
      {
        title: "Gap",
        paragraphs: [
          "Each source is useful on its own, but neither presents the two regions as a linked comparison. A user can retrieve an individual Taiwan term or a Mainland food-name record, yet cannot easily ask whether the same English concept remains identical after script normalization, shares a lexical component, or uses a substantially different Chinese term. Existing spreadsheet, PDF, and screenshot formats also make cross-cutting exploration difficult.",
        ],
      },
      {
        title: "Questions",
        paragraphs: [
          "This project addresses that gap with a static, bilingual interface that links search, filters, four visualizations, and a data grid. The central question is how the same English food concept is rendered in Taiwan and Mainland China, and how far those renderings differ after orthographic normalization. A second question asks whether regional differences travel with translation strategy or with single- versus multiple-equivalent records. The project does not treat the AI labels as a gold standard; it asks what becomes visible when two institutional word lists are aligned and then checked through transparent limitations.",
          "The interface is also intended as a repeatable argument, not only a display. A shared URL preserves the search term, active filters, sorting, and selected record, so an instructor, classmate, or future employer can open the exact view being discussed. Clicking a category in one chart applies it to the others. This matters because translation patterns are relational: the meaning of a category changes when the reader can see its internal equivalence profile and the individual terms that produce it.",
        ],
      },
      {
        title: "Method",
        paragraphs: [
          "I preserved both source descriptions and generated a clean combined CSV and JSON. Cleaning removed presentation markup and surrounding whitespace but did not invent or retranslate any Chinese term. Each source row remains one entry, with a region label and source identifier. Taiwan's first Chinese rendering is used as the principal target for classification, while every alternative remains searchable. Mainland names are added only after an exact normalized English match, which prevents unverified semantic alignment.",
          "The codebook was drafted before the full coding pass and then tested on a small set of contrasting entries. It uses five categories: borrowing or transliteration; calque or literal translation; semantic equivalent or modulation; explicitation; and hybrid rendering. The first four describe a dominant procedure; hybrid is reserved for visible combinations such as a retained acronym plus a Chinese head. Source-oriented labels combine borrowing and calque. Target-oriented labels combine semantic equivalence and explicitation. Mixed orientation contains the hybrid category.",
          "Regional comparison adds a separate decision layer. Taiwan's Traditional Chinese alternatives are converted to Simplified Chinese, stripped of punctuation, and compared with the Mainland name. Identical wording is marked as the same; equality only after conversion is treated as a script variant; containment counts as partial overlap; all remaining cases are different terminology. This prevents the website from reporting traditional-versus-simplified orthography as if it were a lexical disagreement.",
          "The public workflow includes a fixed sample of 50 records selected with a random seed from all 5,792 records. The seed and sample membership are recorded in the downloadable data. A reviewer can compare each sampled pair with its cited source, confirm the current strategy, or flag a correction. The report distinguishes AI classification from human verification rather than using a single unexplained quality claim.",
          "The data model keeps those judgments inspectable. Required fields identify the English source, Chinese target, NAER record, strategy, and human-check status. Optional fields identify the principal rendering, alternative equivalents, orientation, confidence, and classification evidence. The raw ODS, clean CSV, and JSON are all downloadable. This separation lets a reader challenge a category without losing the original record and lets the site be rebuilt after corrections.",
        ],
      },
      {
        title: "Analysis",
        paragraphs: [
          "The Sankey diagram shows the relationship between region, the five strategies, and equivalence status. Its flow view makes the dominant route through each regional register visible without reducing the result to a single percentage. The treemap begins with region by default, then lets the reader switch to orientation or equivalence grouping. Clicking either view applies the corresponding region, category, or equivalence filter to every other component.",
          "The scatter plot compares English character length with the length of the principal Chinese rendering and colours records by region by default. This chart does not treat length as a measure of quality. It helps identify whether one regional register tends toward compact or descriptive labels and exposes outliers for closer reading. Clicking a point selects the record and displays the same-concept wording from the other region. The table is further filterable by region and by the four regional-difference categories.",
          "The interactive table is the evidential anchor. It shows the required source, category, and human-check status alongside the principal rendering, all alternatives, confidence, and evidence. Sorting and filtering update the table and the charts together. The downloadable CSV contains the current filtered set, while the full cleaned corpus and raw ODS remain available. The numbers in every view are computed from the same in-browser records, avoiding the common problem of a chart that looks plausible but disagrees with its table.",
          "The matched subset shows that regional difference is not one phenomenon. Most pairs share at least part of their terminology, while a smaller group uses visibly different words. Some apparent differences disappear once Traditional Chinese is normalized to Simplified Chinese. This result supports a measured conclusion: Taiwan and Mainland Chinese food naming overlap considerably, but shared reference to the same food or nutrient does not guarantee shared terminology.",
          "The equivalence split adds a useful qualification. Among terms with a single Chinese equivalent, about 49.8% are coded as semantic equivalents and 45.5% as calque or literal renderings. Among multi-equivalent terms, the semantic share rises to about 65.0% while the calque share falls to 31.3%. That pattern suggests that records with several Chinese options are more often organized around lexical alternatives than around visibly parallel source structures. It does not prove that equivalence causes a strategy; it simply shows which features travel together in this dataset and gives the next reviewer a concrete hypothesis to test.",
        ],
      },
      {
        title: "Conclusion",
        paragraphs: [
          "The project achieves three things. First, it converts two traceable bilingual sources into one regional corpus with explicit fields and reproducible files. Second, it separates script variation from lexical difference while retaining a five-category translation codebook. Third, it turns those distinctions into a usable public interface with linked search, region filters, visualizations, side-by-side wording, and source lookup.",
          "The conclusion is deliberately qualified. The comparison covers only 91 English concepts with exact-name matches, so it is a focused case study rather than a complete map of Mainland food terminology. Within that matched set, regional terminology is often related but not always identical. The website makes those agreements, partial overlaps, and differences easier to inspect and discuss.",
        ],
      },
      {
        title: "Reflection",
        paragraphs: [
          "The hardest part was not parsing the spreadsheet. It was making a category such as 'literal translation' stable when English compounds, Chinese morphosyntax, and scientific convention pull in different directions. A pair can look structurally direct while a specific word has been modulated. An acronym can be retained, expanded, or translated by meaning. The codebook therefore needed priority rules and boundary examples, not just definitions.",
          "Working with AI made the scale possible, but it also exposed the danger of a confident-looking output. An early rule treated capitalized single words as borrowings. That made AI → 人工智慧 look like a transfer of the English form, when the Chinese term actually translates the concept. Catching that error required looking at the evidence behind the label, not only the label itself. Similar risks remain for brand names and terms with several senses. I would improve the project by adding a second independent coder, calculating agreement, and reviewing a larger stratified sample before treating the full distribution as final.",
          "I would also spend more time distinguishing terminology normalization from translation strategy. Some records may reflect editorial decisions in the Chinese database rather than a translator's choice. The interface should explain that institutional authorship clearly. AI was useful for extraction, interface construction, rule generation, and drafting this report. It could not decide which institutional meaning was authoritative, and it could not replace the act of checking a scientific pair against the source. Those remain human responsibilities.",
        ],
      },
    ],
  },
  zh: {
    eyebrow: "學習報告",
    title: "兩個中文食品社群如何命名同一個科學世界",
    standfirst:
      "本專題比較臺灣食品科學官方術語與中國大陸配對食物名稱，追問哪些差異只是中文字形、哪些共用部分詞語，哪些則真正使用不同的術語。",
    sections: [
      {
        title: "緣起",
        paragraphs: [
          "我一開始選用臺灣樂詞網，因為官方詞表能凸顯翻譯分析中的張力。英文與中文並列時，詞表看似中立，彷彿對等關係早已固定；但每一組詞其實都是選擇的結果。為了讓這些選擇具有比較性，我又加入中國大陸中英文食物名稱中、能與樂詞網英文名稱精確配對的資料。最終語料共有 5,792 筆：完整的臺灣詞表，加上 101 筆中國大陸配對紀錄，涵蓋 91 個共同英文概念。",
          "這個題目也把食品科學與公共語言連結起來。營養術語影響食品標示、臨床溝通、產品資訊與科學教育。當官方資料庫為同一個英文術語提供多個中文對等詞時，術語表表面上的穩定性本身便成為值得分析的現象。",
        ],
      },
      {
        title: "背景",
        paragraphs: [
          "臺灣資料來源為國家教育研究院樂詞網的「農學名詞－食品科學與營養學名詞」資料集，共 5,691 筆，編號、英文詞彙、中文詞彙與更新日期皆無缺漏。中國大陸資料為 GitHub 上的《中國食物成分表》中英文食物名稱資料集，其中 101 筆的正規化英文名稱可與臺灣詞條精確配對。英文配對採取嚴格標準，不自行推測兩個不同食物名稱是否指同一生物或商品。",
          "翻譯研究中的直接與間接程序提供分析的起點。Vinay 與 Darbelnet 區分借譯、仿譯、直譯、詞性轉換、模組、對等與改編。這些類別並非能機械套用的公式，尤其當源語與目標語使用不同文字系統時更是如此；但它們仍有助於建立比較詞彙。顯化研究進一步提醒我們，譯文可能把原本隱含的資訊說明出來。為避免把每個古典程序都拆成獨立標籤，分類規準把相近程序整合為五種可分析的策略。",
          "選擇機構語料也界定了論證的邊界。這些不是由單一譯者為單一讀者產生的譯文，而是經委員會審議、教材慣例、食品法規與長期術語標準化共同形塑的紀錄。本專題可以描述最後呈現的模式，卻無法重建每個中文詞背後的完整商議過程。標明出處因此既是法律要求，也是分析前提：網站比較的是兩種機構語域，而不是自由創作的平行文本。",
        ],
      },
      {
        title: "研究缺口",
        paragraphs: [
          "兩個來源各自都有用，卻沒有把兩地呈現為可連動的比較。使用者可以查到單一臺灣詞條或中國大陸食物名稱，卻不容易追問：同一個英文概念在字形正規化後是否仍然相同、是否共用部分詞語，或使用實質不同的中文名稱。既有試算表、PDF 與截圖形式也使跨欄位探索變得困難。",
        ],
      },
      {
        title: "研究問題",
        paragraphs: [
          "本專題以靜態雙語介面回應這個缺口，把搜尋、篩選、視覺化與資料表串連起來。核心問題是：同一個英文食品概念在臺灣與中國大陸如何呈現？在字形正規化後，兩地譯法相差多遠？第二個問題是：這些跨地差異是否與翻譯策略或單一／多重對等詞相關？本專題不把 AI 分類視為絕對答案，而是檢視兩份機構詞表被嚴格配對後，什麼樣的結構會變得可見。",
          "這個介面也不只是展示，而是一項可重複檢視的論證。分享 URL 會保留搜尋詞、篩選、排序與所選詞條，教師、同學或未來雇主能直接開啟正在討論的視圖。點選其中一張圖的分類，也會套用到其他圖表。翻譯模式具有關係性：當讀者能同時看見類別內部的對等分布，以及產生這些數字的個別詞條時，類別的意義才比較清楚。",
        ],
      },
      {
        title: "方法",
        paragraphs: [
          "我保留兩個來源的描述，並產生合併後的 CSV 與 JSON。清理過程移除呈現標記與前後空白，但不自行發明或重譯中文詞。每個來源列仍是一筆詞條，並附有地區標籤與來源編號。臺灣詞條以第一個中文譯法作為分類目標，其餘對等詞仍可搜尋；中國大陸詞條只有在英文名稱正規化後完全相符時才加入，以免產生未經查證的語意配對。",
          "分類規準在完整編碼前建立，並先以一小組對照詞條測試。五類分別是借譯或音譯；仿譯或直譯；語意對等或轉換；顯化；混用譯法。前四類描述主要程序；混用只保留給明顯結合兩種程序的譯法，例如保留縮寫再加入中文中心詞。源語導向由借譯與仿譯組成；目標語導向由語意對等與顯化組成；混用則歸為混合導向。",
          "Codex 協助翻譯策略分類，並透過可重現規則檢查源語文字、縮寫、明示說明、組合結構、科學詞綴與多重對等。跨地比較另有一層判斷：先把臺灣繁體中文轉為簡體、移除標點，再與中國大陸名稱比較。兩者原字完全相同記為「用詞相同」；轉換後才相同記為「僅字形差異」；一方包含另一方記為「部分重疊」；其餘則為「用詞不同」。",
          "公開流程包含一組固定隨機樣本：從全部 5,792 筆中以固定亂數種子抽出 50 筆，種子與樣本成員都記錄於可下載資料中。檢視者可把每組樣本與來源及分類規準對照，確認目前策略或標記修正。報告明確區分 AI 分類與人工校對，而不使用無法解釋的品質宣稱。",
          "資料模型讓這些判斷可被檢查。必要欄位記錄英文來源、中文譯文、NAER 詞條、策略與人工校對狀態；選用欄位記錄主要譯法、其他對等詞、翻譯導向、信心值與分類證據。原始 ODS、整理後 CSV 與 JSON 均可下載。這種分離讓讀者能質疑某個分類，同時保留原始紀錄，也讓修正後能重新建置網站。",
        ],
      },
      {
        title: "分析",
        paragraphs: [
          "桑基圖呈現地區、五種策略與對等狀態之間的關係。流程視圖讓兩地語料的主要路徑變得可見，而不把結果壓縮成單一百分比。矩形樹圖預設以地區分組，也可切換成翻譯導向或對等狀態。點選任一視圖會把相應地區、分類或對等篩選套用到其他全部元件。",
          "散佈圖比較英文字元長度與主要中文譯法的字數，預設依地區著色。圖表不把長度當成品質指標，而是協助觀察某一地區是否傾向簡短標籤或較長的描述形式。點選資料點會顯示另一地區對同一概念的用詞。資料表另可依地區及四種跨地差異篩選。",
          "互動資料表是分析證據的基礎。它列出必要來源、分類、人工校對狀態、主要譯法、全部對等詞、信心值與證據。排序與篩選會同步更新資料表和圖表。CSV 下載包含目前篩選結果；完整整理語料與原始 ODS 也可取得。所有視圖的數字都由同一批瀏覽器內資料計算，避免圖表看似合理卻與表格不一致。",
          "配對結果顯示，跨地差異並非單一現象。多數詞組至少共用部分術語，較少部分則使用明顯不同的字詞；另有一些表面差異在繁體轉為簡體後消失。這支持一項有所保留的結論：臺灣與中國大陸食品命名有明顯重疊，但指向同一食物或營養素，不代表一定使用相同術語。",
          "對等狀態的拆分提供另一項限制。單一中文對等詞的詞條中，約 49.8% 被歸為語意對等，45.5% 為仿譯或直譯；多重對等詞的詞條中，語意對等比例約為 65.0%，仿譯比例降至 31.3%。這似乎表示具有數個中文選項的紀錄，較常圍繞詞彙替代，而非明顯平行於源語的結構。這不能證明對等狀態造成某種策略，只顯示兩項特徵在此資料中一起出現，並為後續檢視者提供可檢驗的假設。",
        ],
      },
      {
        title: "結論",
        paragraphs: [
          "本專題完成三件事。第一，把兩份可追溯來源整合為一個具有明確欄位與可重現檔案的地區語料。第二，在保留五類翻譯策略之外，區分字形差異與真正的用詞差異。第三，把這些區分轉化為可公開使用的介面，結合搜尋、地區篩選、視覺化、跨地並列與來源查閱。",
          "結論有所保留。比較只涵蓋 91 個能精確配對英文名稱的概念，因此是聚焦個案，而非中國大陸食品術語的完整地圖。在這組配對資料中，兩地術語經常相關，但不總是相同。網站讓這些相同、部分重疊與差異更容易被檢視和討論。",
        ],
      },
      {
        title: "反思",
        paragraphs: [
          "最困難的部分不是解析試算表，而是讓「直譯」等類別在英文複合詞、中文構詞與科學慣例互相牽引時保持穩定。一組詞可能看起來結構直接，卻有某個成分被轉換；一個縮寫也可能被保留、展開或依意義翻譯。因此，分類規準需要優先順序與邊界例子，而不只是定義。",
          "AI 使大規模工作成為可能，也暴露了看似自信的輸出所帶來的風險。早期規則把大寫單詞視為借譯，於是 AI → 人工智慧被誤認為沿用英文形式，實際上中文譯法是在翻譯概念。發現這類錯誤需要查看分類背後的證據，而不能只看標籤本身。品牌名稱與多義詞仍有類似風險。若能改進，我會加入第二位獨立編碼者、計算一致性，並在把整體分布視為最終結果前檢視更大且分層的樣本。",
          "我也會花更多時間區分術語標準化與翻譯策略。有些紀錄可能反映中文資料庫的編輯決定，而不只是譯者的選擇；介面應清楚說明這種機構作者關係。AI 有助於擷取資料、建立介面、產生規則與起草本報告，卻不能決定哪一個機構意義具有權威，也不能取代把科學詞組對照來源進行人工查證。這些仍是人的責任。",
        ],
      },
    ],
  },
} as const;

export const AI_USE = {
  en: {
    title: "AI use declaration",
    intro:
      "This project uses AI as a coding and production assistant under human direction. The declaration distinguishes generated work from decisions and checks that remain the student's responsibility.",
    sections: [
      {
        title: "Tools and model",
        body: [
          "Codex, based on GPT-5, was used in the Codex desktop environment. The website runs without an AI model at runtime; all classifications are stored as static corpus data.",
          "The site uses React, TypeScript, Vite, and D3 modules for interaction and visualization. These libraries do not generate classifications.",
        ],
      },
      {
        title: "What AI was asked to do",
        body: [
          "AI helped parse the Taiwan ODS and the Mainland food-name CSV, match records by normalized English name, preserve source metadata, normalize Traditional Chinese for comparison, draft the translation codebook, classify terms, build the linked interface, calculate descriptive summaries, and draft the learning report and this declaration.",
          "The classification pipeline is static and auditable. Each record includes its region, assigned category, evidence note, and confidence score. Running `scripts/import_mainland.py` and then `scripts/build_corpus.py` reconstructs the combined corpus.",
        ],
      },
      {
        title: "What was checked by hand",
        body: [
          "Both source structures, row counts, IDs, missing values, and the exact-English-name matching rule were checked independently of the website. The 50-entry QA workflow uses a fixed random seed and requires manual comparison with the cited source before an entry can be treated as human-checked.",
          "The user is responsible for completing that 50-entry review and confirming that the report's first-person claims are accurate before submission. Navigation, filters, URL state, chart-table reconciliation, CSV export, and responsive layout are also tested during implementation.",
        ],
      },
      {
        title: "Prompts that worked",
        body: [
          "One effective instruction was to separate the principal Chinese rendering from the full list of alternatives, preserving NAER's term-level record while still allowing equivalence analysis.",
          "Another was to normalize Traditional Chinese to Simplified Chinese before coding regional difference, preventing orthographic variation from being counted as a lexical disagreement.",
        ],
      },
      {
        title: "Sources and permission",
        body: [
          "Taiwan terminology comes from NAER's open-data publication. The Mainland comparison uses only 101 matched bilingual name records from the China Food Composition Table dataset; the full nutritional table is not copied into the site.",
          "The upstream repository provides no open licence. The project owner confirmed permission on 26 November 2026 to publish these matched name records with source attribution.",
        ],
      },
      {
        title: "What AI got wrong",
        body: [
          "An early classification rule treated capitalized single words as borrowings. It therefore labeled AI → 人工智慧 as if the English form had been transferred, even though the Chinese designation translates the concept semantically. The problem was found while inspecting category examples and corrected by excluding all-uppercase acronyms from the borrowing rule.",
          "That error is a reminder that a coherent rule can still encode the wrong assumption. Proper names, brands, and scientific acronyms remain the most uncertain areas and require human review.",
        ],
      },
    ],
  },
  zh: {
    title: "AI 使用聲明",
    intro:
      "本專題在人的指導下把 AI 作為編碼與製作助理。本聲明區分 AI 產出的工作，以及仍須由學生負責的決定與查證。",
    sections: [
      {
        title: "工具與模型",
        body: [
          "本專題使用 Codex 桌面環境中基於 GPT-5 的 Codex。網站在執行時不需呼叫 AI 模型；全部分類均以靜態語料資料形式儲存。",
          "網站交互與視覺化使用 React、TypeScript、Vite 與 D3 模組。這些函式庫不會自行產生分類。",
        ],
      },
      {
        title: "要求 AI 完成的工作",
        body: [
          "AI 協助解析臺灣 ODS 與中國大陸食物名稱 CSV、依正規化英文名稱配對、保留來源資訊、以繁簡轉換支援跨地比較、起草分類規準、編碼詞條、建立連動介面、計算描述統計，並起草學習報告與本聲明。",
          "分類流程為靜態且可稽核。每筆紀錄均含地區、指定類別、證據說明與信心值。依序執行 `scripts/import_mainland.py` 與 `scripts/build_corpus.py` 可重建合併語料。",
        ],
      },
      {
        title: "人工查證內容",
        body: [
          "兩份來源的欄位、列數、編號、缺漏值與英文精確配對規則，均在網站之外獨立檢查。50 筆校對流程使用固定亂數種子，詞條必須與所引來源人工比對後才能視為已校對。",
          "學生須完成 50 筆人工檢視，並在提交前確認報告第一人稱陳述屬實。導覽、篩選、URL 狀態、圖表與表格一致性、CSV 匯出及響應式版面亦在製作期間測試。",
        ],
      },
      {
        title: "有效的提示",
        body: [
          "其中一項有效指令，是把主要中文譯法與完整對等詞清單分開，如此既能保留樂詞網的詞條層級，也能分析對等變異。",
          "另一項是指定每種視覺化回答一個明確問題，並共用同一組篩選狀態，而不是為了湊數而製作互不相關的圖表。",
        ],
      },
      {
        title: "來源與使用許可",
        body: [
          "臺灣術語來自樂詞網的開放資料；中國大陸比較只使用《中國食物成分表》資料集中 101 筆配對中英文名稱，網站不複製完整營養成分表。",
          "上游儲存庫沒有提供開放授權。專題作者已於 2026 年 11 月 26 日確認，可標明來源並公開這些配對名稱紀錄。",
        ],
      },
      {
        title: "AI 出錯的實例",
        body: [
          "早期分類規則把大寫單詞視為借譯，因此把 AI → 人工智慧標成沿用英文形式，但中文名稱其實是以語意方式翻譯概念。檢視各類別例子時發現問題，並排除全大寫縮寫後修正規則。",
          "這個錯誤提醒我們，即使規則內部一致，也可能包含錯誤假設。專名、品牌與科學縮寫仍是最不確定的部分，需要人工檢視。",
        ],
      },
    ],
  },
} as const;
