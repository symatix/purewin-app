


joint.shapes.qad = {};


joint.shapes.qad.Answer = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',

    defaults: joint.util.deepSupplement({
    
        type: 'qad.Answer',
        size: { width: 100, height: 60 },
        attrs: {
            'rect': { fill: '#ffffff', stroke: 'none', width: 100, height: 60, rx: 3, ry: 3 },
            'text': { 'font-size': 14, text: '', lineHeight: 20, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: '#f6f6f6', 'font-family': 'Arial, helvetica, sans-serif' }
        },

        inPorts: [{ id: 'in', label: 'In'}],
        outPorts: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }],
        
    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        
        this.attr('text/text', this.get('answer'));

        this.on('change:answer', function() {

            this.attr('text/text', this.get('answer'));

        }, this);
    }
});

joint.util.measureText = function(text, attrs) {

    var fontSize = parseInt(attrs.fontSize, 10) || 10;
    
    var svgDocument = V('svg').node;
    var textElement = V('<text><tspan></tspan></text>').node;
    var textSpan = textElement.firstChild;
    var textNode = document.createTextNode('');

    textSpan.appendChild(textNode);
    svgDocument.appendChild(textElement);
    document.body.appendChild(svgDocument);

    var lines = text.split('\n');
    var width = 0;

    // Find the longest line width.
    _.each(lines, function(line) {

        textNode.data = line;
        var lineWidth = textSpan.getComputedTextLength();

        width = Math.max(width, lineWidth);
    });

    var height = lines.length * (fontSize * 1.2);

    V(svgDocument).remove();
    
    return { width: width, height: height };
};

joint.shapes.qad.AnswerView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.autoresize();
        this.listenTo(this.model, 'change:answer', this.autoresize, this);
    },

    autoresize: function() {

        var dim = joint.util.measureText(this.model.get('answer'), {
            fontSize: this.model.attr('text/font-size')
        });
        this.model.resize(dim.width + 50, dim.height + 50);
    }
});


joint.shapes.qad.IconSelector  = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="prompt-text"/><g class="options"></g><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port-<%= port.id %>"><circle class="port-body"/><text class="port-label"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'qad.IconSelector',
        size: { width: 1, height: 1 },

        iconSelectorHeight: 45,
        paddingBottom: 20,
        minWidth: 150,
        
        inPorts: [{ id: 'in', label: 'In' }],
        outPorts: [{id: 'out', label:'Out' }],

        attrs: {
            '.': { magnet: false },
            '.body': {
                width: 150, height: 250,
                rx: '1%', ry: '2%',
                stroke: 'none',
                fill: '#000000'
                /*{
                    type: 'linearGradient',
                    stops: [
                        { offset: '0%', color: '#FEB663' },
                        { offset: '100%', color: '#31D0C6' }
                    ],
                    // Top-to-bottom gradient.
                    attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                }*/
            },


            '.options': { ref: '.body', 'ref-x': 0 },
            '.port-body': {
                magnet: true
            },
            '.port-label': {
                'pointer-events': 'none'
            },


            // Text styling.
            text: { 'font-family': 'Arial' },
            '.prompt-text': { 'font-size': 15, dy: 5, fill: 'white', 'ref-x': .5, 'ref-y': 10, 'x-alignment': 'middle', ref: '.body', style: { 'text-shadow': '1px 1px 0px gray' } },
            '.inPorts .port-label': { 'font-size': 10, fill: 'white', x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },
            '.outPorts .port-label': { 'font-size': 10, fill: 'white', x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },

            // Ports styling.
            '.option .port-body': { stroke: 'none', r: 14, fill: '#31d0c6' },
            '.inPorts .port-body': { stroke: 'white', fill: '#feb663', r: 10 },
            '.outPorts .port-body': { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' },
            
        }

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:prompt', function() {
            this.attr('.prompt-text/text', this.get('prompt') || '');
            this.autoresize();
        }, this);

        this.on('change:iconSelectorHeight', function() {
            this.attr('.options/ref-y', this.get('iconSelectorHeight'), { silent: true });
            this.autoresize();
        }, this);

        this.attr('.prompt-text/text', this.get('prompt'), { silent: true });

        joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);
    },

    autoresize: function() {

        var gap = this.get('paddingBottom') || 20;
        var height = this.get('iconSelectorHeight') + gap;
        var width = joint.util.measureText(this.get('question'), {
            fontSize: this.attr('.prompt-text/font-size')
        }).width;
        this.resize(Math.max(this.get('minWidth') || 150, width), height);
    },

    getPortAttrs: function(port, index, total, selector, type) {

        var attrs = {};
        
        var portClass = 'port-' + port.id;
        var portSelector = selector + '>.' + portClass;
        var portTextSelector = portSelector + '>.port-label';
        var portCircleSelector = portSelector + '>.port-body';

        attrs[portTextSelector] = { text: port.label };
        attrs[portCircleSelector] = { port: { id: port.id, type: type, label: port.label } };
        attrs[portSelector] = { ref: '.body', 'ref-x': (index + 0.5) * (1 / total) };
        
        if (selector === '.outPorts') { attrs[portSelector]['ref-dy'] = 0; }

        return attrs;
    },


}));

joint.shapes.qad.IconSelectorView = joint.dia.ElementView.extend(_.extend({}, joint.shapes.basic.PortsViewInterface, {


    initialize: function() {
        joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments);
    },

    renderMarkup: function() {

        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);

    },

}));




joint.shapes.qad.Question = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="question-text"/><g class="options"></g><g class="inPorts"/><g class="outPorts"/><path class="btn-add-option" d="M5,0 10,0 10,5 15,5 15,10 10,10 10,15 5,15 5,10 0,10 0,5 5,5z"/></g>',
    portMarkup: '<g class="port port-<%= port.id %>"><circle class="port-body" /><text class="port-label"/></g>',
    optionMarkup: '<g class="option"><rect class="option-rect"/><path class="btn-remove-option" d="M0,0 10,0 10,3 0,3z"/><text class="option-text"/><g class="option-port"><circle class="port-body"/><text class="port-label"/></g></g>',

    defaults: joint.util.deepSupplement({

        type: 'qad.Question',
        size: { width: 1, height: 1 },

        optionHeight: 30,
        questionHeight: 45,
        paddingBottom: 20,
        minWidth: 150,
        
        inPorts: [{id: 'in', group:'in'}],
        outPorts: [],
        attrs: {
            '.': { magnet: false },
            '.body': {
                width: 150, height: 250,
                //rx: '1%', ry: '2%',
                fill: '#454e54'
                /*{

                    type: 'linearGradient',
                    stops: [
                        { offset: '0%', color: '#FEB663' },
                        { offset: '100%', color: '#31D0C6' }
                    ],
                    // Top-to-bottom gradient.
                    attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                } */
            },
            '.btn-add-option': {
                ref: '.body', 'ref-x': 10, 'ref-dy': -17, cursor: 'pointer', fill:'#e3e6e8'
            },
            '.btn-remove-option': {
                'x-alignment': 5, 'y-alignment': 13, cursor: 'pointer', fill:'#000000'
            },
            '.options': { ref: '.body', 'ref-x': 0 },
            '.port-body': {
                magnet: true
            },
            '.port-label': {
                'pointer-events': 'none'
            },
            '.option-port': {
                ref: '.body', 'ref-dx': 0, 'y-alignment': 15
            },

            // Text styling.
            text: { 'font-family': 'Arial' },
            '.option-text': { 'font-size': 11, dy: 5, fill: '#4b4a67', 'y-alignment': .4, 'x-alignment': 20 },
            '.question-text': { 'font-size': 15, dy: 5, 
            //fill: 'white', 
            'ref-x': .5, 'ref-y': 10, 'x-alignment': 'middle', ref: '.body', },
            '.inPorts .port-label': { 'font-size': 10, fill: 'rgba(0,0,0,0)', 
            //fill: 'white', 
            x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },
            '.outPorts .port-label': { 'font-size': 10, 
            //fill: 'white', 
            x: 0, dy: 0, 'text-anchor': 'middle', 'y-alignment': 'middle' },

            // Ports styling.
            '.option .port-body': { stroke: 1, 'stroke-width':1, r: 5, fill: 'black' /* #31d0c6 */},
            '.inPorts .port-body': { 'port-group':'in', stroke: 'white', fill: '#ffffff', r: 6,stroke: '#000000', 'stroke-width': 1 },
            '.outPorts .port-body': { stroke: 'none', fill: '#000000', r: 6 },
            
            // Options styling.
            '.option-rect': {
                rx: 1, ry: 1,
                stroke: 'lightgrey', 'stroke-width': 1, 'stroke-opacity': .5,
                //'fill-opacity': .5,
                fill: 'white',
                ref: '.body',
                'ref-width': 1
            }
        }

    }, joint.shapes.basic.Generic.prototype.defaults),

    initialize: function() {

        this.on('change:options', this.onChangeOptions, this);
        this.on('change:question', function() {
            this.attr('.question-text/text', this.get('question') || '');
            this.autoresize();
        }, this);

        this.on('change:questionHeight', function() {
            this.attr('.options/ref-y', this.get('questionHeight'), { silent: true });
            this.autoresize();
        }, this);

        this.on('change:optionHeight', this.autoresize, this);

        this.attr('.options/ref-y', this.get('questionHeight'), { silent: true });
        this.attr('.question-text/text', this.get('question'), { silent: true });

        this.onChangeOptions();
        joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments);
    },

    onChangeOptions: function() {

        var options = this.get('options');
        var size = this.get('size');
        var optionHeight = this.get('optionHeight');

        // First clean up the previously set attrs for the old options object.
        // We mark every new attribute object with the `dynamic` flag set to `true`.
        // This is how we recognize previously set attributes.
        var attrs = this.get('attrs');
        _.each(attrs, function(attrs, selector) {

            if (attrs.dynamic) {
                // Remove silently because we're going to update `attrs`
                // later in this method anyway.
                this.removeAttr(selector, { silent: true });
            }
        }, this);
        
        // Collect new attrs for the new options.
        var offsetY = 0;
        var attrsUpdate = {};
        _.each(options, function(option) {
            
            var selector = '.option-' + option.id;

            attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
            attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };
            attrsUpdate[selector + ' .option-port .port-body'] = { port: option.id, dynamic: true };
            attrsUpdate[selector + ' .option-text'] = { text: option.text, dynamic: true };

            offsetY += optionHeight;

        }, this);

        this.attr(attrsUpdate);
        this.autoresize();
    },

    autoresize: function() {

        var options = this.get('options') || [];
        var gap = this.get('paddingBottom') || 20;
        var height = options.length * this.get('optionHeight') + this.get('questionHeight') + gap;
        var width = joint.util.measureText(this.get('question'), {
            fontSize: this.attr('.question-text/font-size')
        }).width;
        this.resize(Math.max(this.get('minWidth') || 150, width), height);
    },

    getPortAttrs: function(port, index, total, selector, type) {

        var attrs = {};
        
        var portClass = 'port-' + port.id;
        var portSelector = selector + '>.' + portClass;
        var portTextSelector = portSelector + '>.port-label';
        var portCircleSelector = portSelector + '>.port-body';

        attrs[portTextSelector] = { text: port.label };
        attrs[portCircleSelector] = { port: { id: port.id, type: type, label: port.label } };
        attrs[portSelector] = { ref: '.body', 'ref-x': (index + 0.5) * (1 / total) };
        
        if (selector === '.outPorts') { attrs[portSelector]['ref-dy'] = 0; }

        return attrs;
    },

    addOption: function(option) {
console.log('in addOption');   
        var options = JSON.parse(JSON.stringify(this.get('options')));
        options.push(option);
        this.set('options', options);
    },

    removeOption: function(id) {
    
        var options = JSON.parse(JSON.stringify(this.get('options')));
        this.set('options', _.without(options, _.findWhere(options, { id: id })));
    },

    changeOption: function(id, option) {

        if (!option.id) {
            option.id = id;
        }

        var options = JSON.parse(JSON.stringify(this.get('options')));
        options[_.findIndex(options, { id: id })] = option;
        this.set('options', options);
    }
}));

joint.shapes.qad.QuestionView = joint.dia.ElementView.extend(_.extend({}, joint.shapes.basic.PortsViewInterface, {

    events: {
        'click .btn-add-option': 'onAddOption',
        'click .btn-remove-option': 'onRemoveOption'
    },

    initialize: function() {

        this.listenTo(this.model, 'change:options', this.renderOptions, this);
        joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments);
    },

    renderMarkup: function() {

        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);

        // A holder for all the options.
        this.$options = this.$('.options');
        // Create an SVG element representing one option. This element will
        // be cloned in order to create more options.
        this.elOption = V(this.model.optionMarkup);

        this.renderOptions();
    },

    renderOptions: function() {

        this.$options.empty();
        
        _.each(this.model.get('options'), function(option, index) {

            var className = 'option-' + option.id;
            var elOption = this.elOption.clone().addClass(className);
            elOption.attr('option-id', option.id);
            this.$options.append(elOption.node);

        }, this);

        // Apply `attrs` to the newly created SVG elements.
        this.update();
    },

    onAddOption: function() {
console.log('in onAddOption');
        this.model.addOption({
            id: _.uniqueId('option-'),
            text: 'Option ' + this.model.get('options').length
        });
    },

    onRemoveOption: function(evt) {

        this.model.removeOption(V(evt.target.parentNode).attr('option-id'));
    }
}));


// MAKE A COPY OF QUESTION TYPE, CALL IT 'FREE', OR SOMETHING, THEN TWEAK 
// TEXT EDITING FUNCTIONALITY, MAKE OUTPORTS=1, REMOVE ABILITY TO ADD OUTPORTS
