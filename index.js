/**
 * @file   mofron-comp-calender/index.js
 * @author simpart
 */
const mf       = require('mofron');
const Text     = require('mofron-comp-text');
const Table    = require('mofron-comp-table');
const HrzPos   = require('mofron-effect-hrzpos');
const Click    = require('mofron-event-click');
const Hover = require('mofron-event-hover');

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
            this.child([this.month(), this.table()]);
            this.table().execOption({ child : this.week() });  /* add week */
            
            /* day index text */
            let hvr_fnc = (tgt, flg, prm) => {
                try { prm.hoverStyle(tgt.adom().parent() ,flg); } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };
            let day_clk = (tgt, clk, prm) => {
                try {
                    let idx = parseInt(tgt.text());
                    if (('number' !== typeof idx) || (0 === idx)) {
                        return;
                    }
                    if (null !== prm.dayClickEvent()) {
                        prm.dayClickEvent()[0](tgt, idx, prm.dayClickEvent()[1]);
                    }
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };
            
            // add date element
            for (let idx=0; idx < 42; idx++) {
                this.table().execOption({
                    child : [
                        new Text({
                            event : [new Hover([hvr_fnc, this]), new Click([day_clk,this])]
                        })
                    ]
                });
            }
            
            this.date(new Date());
            this.size('6rem', '4rem');
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    month (prm) {
        try {
            if (undefined !== prm) {
                prm.execOption({ size: '0.4rem', effect: [ new HrzPos('center') ] });
            }
            return this.innerComp('month', prm, Text);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    table (prm) {
        try {
            if (undefined !== prm) {
                prm.execOption({ colLength: 7 });
            }
            return this.innerComp('table', prm, Table);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    } 
    
    week (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_weekstr) {
                    this.week(['Sun','Mon','Tue','Wed','Thu','Fri','Sat']);
                }
                return this.m_weekstr;
            }
            /* setter */
            if (true === Array.isArray(prm)) {
                let set_val = new Array();
                for (let pidx in prm) {
                    if ('string' === typeof prm[pidx]) {
                        set_val.push(new Text(prm[pidx]));
                    } else if (true === mf.func.isInclude(prm[pidx], 'Text')) {
                        set_val.push(prm[pidx]);
                    } else {
                        throw new Error('invalid parameter');
                    }
                }
                this.m_weekstr = set_val;
            } else {
                throw new Error('invalid parameter');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    dayText (prm) {
        try {
            if (true !== mf.func.isInclude(prm, 'Text')) {
                /* getter */
                return ('number' === typeof prm) ? this.m_daytxt[prm] : this.m_daytxt;
            }
            /* setter */
            if (undefined === this.m_daytxt) {
                this.m_daytxt = [];
            }
            this.m_daytxt.push(prm);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    date (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_date) {
                    this.date(new Date());
                }
                return this.m_date;
            }
            /* setter */
            /* set month */
            this.month().execOption({
                text : (1 + prm.getMonth()) + ''
            });
            /* set day */
            this.m_date = prm;
            
            let fdt    = this.get1stDate();
            let dayTxt = [];
            
            let buf = this.table().child();
            for (let bidx in buf) {
                if (6 >= parseInt(bidx)) {
                    continue;
                }
                dayTxt.push(buf[bidx]);
            }
            
            for (let upidx=0; upidx < 50 ;upidx++) {
                if (upidx < fdt.getDay()) {
                    continue;
                }
                if ( (31 < fdt.getDate()) || ((1 == fdt.getDate()) && (20 < upidx)) ) {
                    break;
                }
                if ( (fdt.getDate()     === new Date().getDate())    &&
                     (fdt.getMonth()    === new Date().getMonth())   &&
                     (fdt.getFullYear() === new Date().getFullYear()) ) {
                    this.todayStyle(dayTxt[upidx].adom().parent(), dayTxt[upidx]);
                }
                
                dayTxt[upidx].text(fdt.getDate() + '');
                this.dayText(dayTxt[upidx]);
                fdt.setDate(fdt.getDate() + 1);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    get1stDate () {
        try {
            let downdt = new Date(this.date().toString());
            for (let dwidx=31; dwidx > 0 ;dwidx--) {
                if (1 === downdt.getDate()) {
                    return downdt;
                }
                downdt.setDate(downdt.getDate()-1);
            }
            throw new Error('failed get first date');
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    width (prm) {
        try { return this.table().width(prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    height (prm) {
        try { return this.table().height(prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    todayStyle (tgt, txt) {
        try {
            txt.execOption({ mainColor : 'white' });
            tgt.style({ 'background' : 'rgba(113, 136, 153, 1)' });
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    hoverStyle (tgt, flg) {
        try {
            tgt.style({
                'border' : (true === flg) ? 'solid 1px rgba(113, 136, 153, 1)' : null
            });
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    dayClickEvent (fnc, prm) {
        try {
            if (undefined === fnc) {
                /* getter */
                return (undefined === this.m_dayclkevt) ? null : this.m_dayclkevt;
            }
            /* setter */
            if ('function' !== typeof fnc) {
                throw new Error('invalid parameter');
            }
            this.m_dayclkevt = [fnc, prm];
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.comp.Calendar;
/* end of file */
