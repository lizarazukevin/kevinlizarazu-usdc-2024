/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
 function findSearchTermInBooks(searchTerm, scannedTextObj) {
    /** You will need to implement your search and 
     * return the appropriate object here. */

    // Create our result object containing the original search term and results consisting of ISBN, Page, and Line
    // By default the results are blank if no titles or lines containing the term are present 
    var result = {
        "SearchTerm": searchTerm,
        "Results": []
    };

    // Check if searchTerm is valid
    if (typeof(searchTerm) != "string" || searchTerm === "") {
        console.log(`Invalid Search Term Input!`)
        return result;
    }

    // Check if scannedTextObj is valid
    if (typeof(scannedTextObj) != "object") {
        console.log(`Invalid Scanned Text Object Input!`)
        return result;
    }

    // Create a regular expression from searchTerm to so we can search for it in the text
    const reg = new RegExp(searchTerm)

    // Iterate through our book objects, and its page contents, and search for a match found in the text
    for (let i = 0; i < scannedTextObj.length; i++) {
        // Check for all fields here before continuing
        if (!scannedTextObj[i].Title || !scannedTextObj[i].ISBN || !scannedTextObj[i].Content) {
                console.log(`Critical Book Identifiers Missing for Book Item ${i + 1}`);
                continue;
            }

        let isbn = scannedTextObj[i].ISBN;
        let content = scannedTextObj[i].Content;

        // Hyphen detected, for prev comparisons
        let hyph = {
            "Prev": "",
            "Page": 0,
            "Line": 0,
        }

        // Iterate through content
        for (let j = 0; j < content.length; j++) {
            if (!content[j].Page || !content[j].Line || !content[j].Text || content[j].Page < 0 || content[j].Line < 0) {
                console.log(`Critical Content Identifiers Invalid for Book Item ${i + 1}, Scanned Item ${j + 1}`);
                continue;
            }

            let page = content[j].Page;
            let line = content[j].Line;
            let text = content[j].Text;
            let trimmedText = text.trim();
            let splitText = trimmedText.split(' ');

            // Check if we're looking for a hyph match
            if (hyph.Prev != ""){
                // match here for regex
                if ((hyph.Page == page && hyph.Line + 1 == line) || hyph.Page + 1 == page && line == 1) {
                    let combinedWord = hyph.Prev + splitText[0];
                    if (combinedWord === searchTerm) {
                        result.Results.push({
                            "ISBN": isbn,
                            "Page": hyph.Page,
                            "Line": hyph.Line
                        })
                    }
                }

                // Clear for next hyphenated line
                hyph.Prev = "";
                hyph.Page = 0;
                hyph.Line = 0;
            }

            // Initial line search for word
            let match = text.search(reg)
            if (match != -1) {
                result.Results.push({
                    "ISBN": isbn,
                    "Page": page,
                    "Line": line,
                })
            }

            // Check for any words that end in hyphens
            if (trimmedText.charAt(trimmedText.length - 1) == "-") {
                let lastWord = splitText[splitText.length - 1].slice(0, -1);

                hyph.Prev = lastWord;
                hyph.Page = page;
                hyph.Line = line;
            }
        }
    }  
    
    return result; 
}

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]
    
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

let test_counter = 0;
let pos_counter = 0;

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
test_counter += 1;
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
    pos_counter += 1;

} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
test_counter += 1;
if (test2result.Results.length == 1) {
    pos_counter += 1;
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Hyphenated words to new lines
const testContinued = findSearchTermInBooks("darkness", twentyLeaguesIn);
const continuedOut = {
    "SearchTerm": "darkness",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
}
test_counter += 1;
if (JSON.stringify(continuedOut) === JSON.stringify(testContinued)) {
    console.log("PASS: Hyphenated Word");
    pos_counter += 1;

} else {
    console.log("FAIL: Hyphenated Word");
    console.log("Expected:", continuedOut);
    console.log("Received:", testContinued);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Punctuated Word
const testPunct = findSearchTermInBooks("Canadian's", twentyLeaguesIn);
const punctOut = {
    "SearchTerm": "Canadian's",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}
test_counter += 1;
if (JSON.stringify(punctOut) === JSON.stringify(testPunct)) {
    console.log("PASS: Punctuated Word");
    pos_counter += 1;

} else {
    console.log("FAIL: Punctuated Word");
    console.log("Expected:", punctOut);
    console.log("Received:", testPunct);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Single letter match and case sensitive
const testSingleLetter = findSearchTermInBooks('i', twentyLeaguesIn);
test_counter += 1;
const singleLetterOut = {
    "SearchTerm": "i",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        },
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

if (JSON.stringify(singleLetterOut) === JSON.stringify(testSingleLetter)) {
    console.log("PASS: Single Letter and Case Sensitive");
    pos_counter += 1;
} else {
    console.log("FAIL: Single Letter and Case Sensitive");
    console.log("Expected:", singleLetterOut);
    console.log("Received:", testSingleLetter);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Multiple word match
const testMultipleWord = findSearchTermInBooks("how he had", twentyLeaguesIn);
test_counter += 1;
const multipleWordOut = {
    "SearchTerm": "how he had",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 10
        }
    ]
}

if (JSON.stringify(multipleWordOut) === JSON.stringify(testMultipleWord)) {
    console.log("PASS: Multiple Word Search Term");
    pos_counter += 1;
} else {
    console.log("FAIL: Multiple Word Search Term");
    console.log("Expected:", multipleWordOut);
    console.log("Received:", testMultipleWord);
}
////////////////////////////////////////////////////////////////////////////////////////////////
// No search term or invalid
const testEmptySearch = findSearchTermInBooks("", twentyLeaguesIn);
test_counter += 1;
const emptySearchOutput = {
    "SearchTerm": "",
    "Results": []
}

if (JSON.stringify(emptySearchOutput) == JSON.stringify(testEmptySearch)) {
    console.log("PASS: Empty Search Term");
    pos_counter += 1;
} else {
    console.log("FAIL: Empty Search Term");
    console.log("Expected:", emptySearchOutput);
    console.log("Received:", testEmptySearch);
}

const testInvalidSearch = findSearchTermInBooks(1, twentyLeaguesIn);
test_counter += 1;
const invalidSearchOutput = {
    "SearchTerm": 1,
    "Results": []
}

if (JSON.stringify(invalidSearchOutput) == JSON.stringify(testInvalidSearch)) {
    console.log("PASS: Invalid Search Term");
    pos_counter += 1;
} else {
    console.log("FAIL: Invalid Search Term");
    console.log("Expected:", invalidSearchOutput);
    console.log("Received:", testInvalidSearch);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Inavlid Scanned Text Object

const invalidTextObj = 1;
const testInvalidTextObj = findSearchTermInBooks("now", invalidTextObj);
test_counter += 1;
const invalidTextObjOutput = {
    "SearchTerm": "now",
    "Results": []
}

if (JSON.stringify(invalidTextObjOutput) == JSON.stringify(testInvalidTextObj)) {
    console.log("PASS: Invalid Scanned Text Object");
    pos_counter += 1;
} else {
    console.log("FAIL: Invalid Scanned Text Object");
    console.log("Expected:", invalidTextObjOutput);
    console.log("Received:", testInvalidTextObj);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Multiple matches in one line
test_counter += 1;
const multipleMatches = [
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "now eyes were the ones I asked for now"
            } 
        ]
    }
]

const multipleMatchesOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
testMultipleMatches = findSearchTermInBooks("now", multipleMatches);
if (JSON.stringify(multipleMatchesOutput) === JSON.stringify(testMultipleMatches)) {
    console.log("PASS: Multiple Line Matches");
    pos_counter += 1;
} else {
    console.log("FAIL: Multiple Line Matches");
    console.log("Expected:", multipleMatchesOutput);
    console.log("Received:", testMultipleMatches);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Multiple matches across several lines
test_counter += 1;
const matchLines = [
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "now eyes were the ones I asked for now"
            },
            {
                "Page": 33,
                "Line": 11,
                "Text": "now I see"
            }
        ]
    }
]

const matchLinesOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        },
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 11
        }
    ]
}
testMatchLines = findSearchTermInBooks("now", matchLines);
if (JSON.stringify(matchLinesOutput) === JSON.stringify(testMatchLines)) {
    console.log("PASS: Matches on Multiple Lines");
    pos_counter += 1;
} else {
    console.log("FAIL: Matches on Multiple Lines");
    console.log("Expected:", matchLinesOutput);
    console.log("Received:", testMatchLines);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Multiple matches across several pages
test_counter += 1;
const matchPages = [
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "now eyes were the ones I asked for now"
            },
            {
                "Page": 34,
                "Line": 11,
                "Text": "now I see"
            }
        ]
    }
]

const matchPagesOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        },
        {
            "ISBN": "1234578910112",
            "Page": 34,
            "Line": 11
        }
    ]
}
testMatchPages = findSearchTermInBooks("now", matchPages);
if (JSON.stringify(matchPagesOutput) === JSON.stringify(testMatchPages)) {
    console.log("PASS: Matches on Multiple Pages");
    pos_counter += 1;
} else {
    console.log("FAIL: Matches on Multiple Pages");
    console.log("Expected:", matchPagesOutput);
    console.log("Received:", testMatchPages);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Empty Book List
test_counter += 1;
const emptyList = []

const emptyListOutput = {
    "SearchTerm": "the",
    "Results": []
}
const testEmptyList = findSearchTermInBooks("the", emptyList);
if (JSON.stringify(emptyListOutput) === JSON.stringify(testEmptyList)) {
    console.log("PASS: Empty Book List");
    pos_counter += 1;
} else {
    console.log("FAIL: Empty Book List");
    console.log("Expected:", emptyListOutput);
    console.log("Received:", testEmptyList);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Book with empty or content
test_counter += 1;
const emptyContent = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [] 
    },
    {
        "Title": "Random Book",
        "ISBN": "9780000521234"
    },
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "eyes were the ones I asked for"
            } 
        ]
    }
]

const emptyContentOutput = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
const testEmptyContent = findSearchTermInBooks("the", emptyContent);
if (JSON.stringify(emptyContentOutput) === JSON.stringify(testEmptyContent)) {
    console.log("PASS: Empty Content");
    pos_counter += 1;
} else {
    console.log("FAIL: Empty Content");
    console.log("Expected:", emptyContentOutput);
    console.log("Received:", testEmptyContent);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Book with empty or no title
test_counter += 1;
const emptyTitle = [
    {
        "Title": "",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "ISBN": "9780000521234",
        "Content": [
            {
                "Page": 21,
                "Line": 9,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "eyes were the ones I asked for now"
            } 
        ]
    }
]

const emptyTitleOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
const testEmptyTitle = findSearchTermInBooks("now", emptyTitle);
if (JSON.stringify(emptyTitleOutput) === JSON.stringify(testEmptyTitle)) {
    console.log("PASS: Empty Title");
    pos_counter += 1;
} else {
    console.log("FAIL: Empty Title");
    console.log("Expected:", emptyTitleOutput);
    console.log("Received:", testEmptyTitle);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Book with empty or no ISBN
test_counter += 1;
const emptyISBN = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Random Book",
        "Content": [
            {
                "Page": 21,
                "Line": 9,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "eyes were the ones I asked for now"
            } 
        ]
    }
]

const emptyISBNOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
const testEmptyISBN = findSearchTermInBooks("now", emptyISBN);
if (JSON.stringify(emptyISBNOutput) === JSON.stringify(testEmptyISBN)) {
    console.log("PASS: Empty ISBN");
    pos_counter += 1;
} else {
    console.log("FAIL: Empty ISBN");
    console.log("Expected:", emptyISBNOutput);
    console.log("Received:", testEmptyISBN);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Books with missing page number or negative number
test_counter += 1;
const missingPage = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Random Book",
        "ISBN": "9780000521234",
        "Content": [
            {
                "Page": -21,
                "Line": 9,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "eyes were the ones I asked for now"
            } 
        ]
    }
]

const emptyPageOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
const testEmptyPage = findSearchTermInBooks("now", missingPage);
if (JSON.stringify(emptyPageOutput) === JSON.stringify(testEmptyPage)) {
    console.log("PASS: Missing Page");
    pos_counter += 1;
} else {
    console.log("FAIL: Missing Page");
    console.log("Expected:", emptyPageOutput);
    console.log("Received:", testEmptyPage);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Books with missing line number or negative line
test_counter += 1;
const missingLine = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Random Book",
        "ISBN": "9780000521234",
        "Content": [
            {
                "Page": 21,
                "Line": -9,
                "Text": "now simply went on by her own momentum.  The dark-"
            }
        ] 
    },
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "eyes were the ones I asked for now"
            } 
        ]
    }
]

const missingLineOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
const testMissingLine = findSearchTermInBooks("now", missingLine);
if (JSON.stringify(missingLineOutput) === JSON.stringify(testMissingLine)) {
    console.log("PASS: Missing Line");
    pos_counter += 1;
} else {
    console.log("FAIL: Missing Line");
    console.log("Expected:", missingLineOutput);
    console.log("Received:", testMissingLine);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Books with empty or missing
test_counter += 1;
const missingText = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8
            }
        ] 
    },
    {
        "Title": "Random Book",
        "ISBN": "9780000521234",
        "Content": [
            {
                "Page": 21,
                "Line": 9,
                "Text": ""
            }
        ] 
    },
    {
        "Title": "Another Random Book",
        "ISBN": "1234578910112",
        "Content": [
            {
                "Page": 33,
                "Line": 10,
                "Text": "eyes were the ones I asked for now"
            } 
        ]
    }
]

const missingTextOutput = {
    "SearchTerm": "now",
    "Results": [
        {
            "ISBN": "1234578910112",
            "Page": 33,
            "Line": 10
        }
    ]
}
const testMissingText = findSearchTermInBooks("now", missingText);
if (JSON.stringify(missingTextOutput) === JSON.stringify(testMissingText)) {
    console.log("PASS: Missing Text");
    pos_counter += 1;
} else {
    console.log("FAIL: Missing Text");
    console.log("Expected:", missingTextOutput);
    console.log("Received:", testMissingText);
}

////////////////////////////////////////////////////////////////////////////////////////////////
console.log(`${test_counter} tests ran, ${pos_counter} passed.`)