# glines.js
#### Simple plain-javascript tool for easy markup testing with guide lines

You don't need jQuery to use glines.js.

glines.js is mostly browser console utility, so all following methods will work in console.

To get fast API-help just type glines.help() in browser console after glines.js was included.

demo.html contains all docs and examples.

#### Examples

Use this simple command to add vertical guideline:

    glines.addLine();
    
You can move this guideline using mouse.

Try to change parameters:

    glines.addLine('h', {color: '#f00', size: '1px'});
    
This command will add horizontal red one-pixel guideline.

Single click on line makes it active, so you also can move it using keyboard arrows.

This is how to remove all guidelines:

    glines.removeAll();
    
If you want to remove one line, use double click.
