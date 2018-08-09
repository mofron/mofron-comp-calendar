/**
 * @file   mofron-comp-calender/index.js
 * @author simpart
 */
const mf     = require('mofron');
const Text   = require('mofron-comp-text');
const Table  = require('mofron-comp-table');
const HrzPos = require('mofron-effect-hrzpos');

/**
 * @class mofron.comp.Calender
 * @brief Calender component for mofron
 */
mf.comp.Calendar = class extends mf.Component {
    
    /**
     * initialize component
     * 
     * @param po paramter or option
     */
    constructor (po) {
        try {
            super();
            this.name('Calendar');
            this.prmMap('date');
            this.prmOpt(po);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     * 
     * @param prm : 
     */
    initDomConts () {
        try {
            super.initDomConts();
            
            /* month */
            let table = new Table({
                colLength : 7,
                child     : [
                    new Text('Sun'),
                    new Text('Mon'),
                    new Text('Tue'),
                    new Text('Wed'),
                    new Text('Thu'),
                    new Text('Fri'),
                    new Text('Sat'),
                ]
            });
            this.child([
                new Text({
                    effect : [ new HrzPos('center') ],
                    size   : 0.4,
                    text   : ''
                }),
                table
            ]);
            
            /* day */
            for (let idx=0; idx < 35; idx++) {
                table.execOption({
                    child : [ new Text('') ]
                })
            }
            
            this.date(new Date());
            this.size(6, 4);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    date (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                return (undefined === this.m_date) ? null : this.m_date;
            }
            /* setter */
            this.getChild(true)[0].execOption({
                text : (1 + prm.getMonth()) + ''
            });
            let tbl_chd = this.getChild(true)[1].child();
            for (let idx=10;idx < 41; idx++) {
                tbl_chd[idx].text((idx - 9) + '');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    width (prm) {
        try {
            let ret = super.width(prm);
            if (undefined === ret) {
                this.getChild(true)[1].execOption({
                    width : prm
                });
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    height (prm) {
        try {
            let ret = super.height(prm);
            if (undefined === ret) {
                this.getChild(true)[1].execOption({
                    height : prm
                });
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.comp.Calendar;
/* end of file */
