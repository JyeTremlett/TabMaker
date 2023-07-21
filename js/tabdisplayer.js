/*
Author: Jye Tremlett
Created: 7/7/2023
*/


function startFlow() {

    // get width from radio buttons
    let width;
    if (document.getElementById('width8').checked) {
        width = document.getElementById('width8').value;
    }
    else if (document.getElementById('width16').checked) {
        width = document.getElementById('width16').value;
    }

    console.log(width);
    // create tab object and show user input interface
    let tab = new Tab(width);
    tab.displayInputBoxes('.tab_interactive');

    // add onclick event listener for submit button
    let btn = document.getElementById('submit-tab-btn')
    btn.addEventListener('click', function () {
        tab.getInput(); // update tab.data property before displaying tab
        tab.displayTab('.tab_visualised');
    }, false);
}


/* 
Construction function for a Tab object. Tab object represents a guitar tab that is stored as a 2D 
array. Width is the number of spaces for fret number inputs in each string (in other words, the
number of forms in each row).
*/
function Tab(width) {

    // data property is a 2D array holding tab values
    this.data = new Array(6);

    // set number of increments in a tab
    this.width = width;

    // build rows and columns
    for (let string = 0; string < 6; string++) {
        this.data[string] = new Array(width);
        for (let increment = 0; increment < width; increment++) {
            this.data[string][increment] = '';
        }
    }



    /*
    This function displays the interface for users to enter tab values into. The "section" field is a string
    of the class of the html element to display the interface within.
    */
    this.displayInputBoxes = function (section) {

        let context = document.querySelector(section);
        let output = '';

        for (let string = 0; string < 6; string++) {
            output += '|';
            for (let increment = 0; increment < width; increment++) {
                // set id to the xy coordinates of the field. This is used later to identify
                // where the field's input should be stored within the data[][] array.
                let id = `"${string}-${increment}"`;
                output += `<input type="number" id=${id} class="note" placeholder="-">`;
            }
            output += '|<br>';
        }

        // add submit button
        output += '<input type="button" id="submit-tab-btn" value="convert to text">';

        // set context's inner html to a string representation of the tab
        context.innerHTML = output;
    }



    /*
    function that parses each 'note' input field and updates the tab.data array with any new input
    */
    this.getInput = function () {

        let string;
        let increment;
        let notes = document.getElementsByClassName('note'); // get all tab input field values

        // for each nonempty field, copy into this.data array
        for (const note of notes) {
            if (note.value != "") {
                // note.id contains the xy coordinates needed to correctly place notevalue in data[][]  
                string = parseInt(note.id.split('-')[0]);
                increment = parseInt(note.id.split('-')[1]);

                this.data[string][increment] = note.value;
            }
        }
    }



    /*
    Function that writes the content of the tab object to the inner html of the tag with a class matching 
    the string provided by the "section" field
    */
    this.displayTab = function (section) {

        let note;
        let context = document.querySelector(section);
        let output = '';

        let stringnames = ['e', 'B', 'G', 'D', 'A', 'E']

        for (let string = 0; string < 6; string++) {
            output += (stringnames[string] + '|');
            for (let increment = 0; increment < width; increment++) {

                // get current note
                note = this.data[string][increment];

                if (note == '') note = '--';

                // append a dash if the fret number of the note is only one digit. 
                // this is  important for spacing the output.
                else if (parseInt(note) < 10) note += '-';

                // add an extra dash so that adjacent two digit fret numbers don't clash
                output += (note + '-');
            }
            output += '|';
            output += '<br>';
        }

        // set context's inner html to a string representation of the tab
        context.innerHTML = '<p>' + output + '</p>';
    }
}




