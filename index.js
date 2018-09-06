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
            
            this.child([
                this.month(),
                this.table()
            ]);
            
            this.table().execOption({
                child : this.weekString()  /* week */
            });
            
            /* day index text */
            let mous_evt = (tgt, prm, flg) => {
                try {
                    tgt.adom().parent().style(
                        prm.hoverStyle(flg)
                    );
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            let day_clk = (tgt, prm) => {
                try {
                    if (null !== prm.dayClickEvent()) {
                        prm.dayClickEvent()[0](tgt, prm.dayClickEvent()[1]);
                    }
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            for (let idx=0; idx < 42; idx++) {
                this.table().execOption({
                    child : [
                        new Text({
                            text  : '',
                            event : [
                                new Hover(new mf.Param(mous_evt, this)),
                                new Click(new mf.Param(day_clk,this))
                            ]
                        })
                    ]
                })
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
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_month) {
                    this.month(
                        new Text({
                            effect : [ new HrzPos('center') ],
                            size   : '0.4rem',
                            text   : ''
                        })
                    );
                }
                return this.m_month;
            }
            /* setter */
            if (true !== mf.func.isInclude(prm, 'Text')) {
                throw new Error('invalid parameter');
            }
            this.m_month = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    table (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_table) {
                    this.table(new Table({ colLength : 7 }));
                }
                return this.m_table;
            }
            /* setter */
            if (true !== mf.func.isInclude(prm, 'Table')) {
                throw new Error('invalid parameter');
            }
            this.m_table = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    } 
    
    weekString (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_weekstr) {
                    this.weekString(['Sun','Mon','Tue','Wed','Thu','Fri','Sat']);
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
    
    getDayText (prm) {
        try {
            if (undefined === prm) {
                let ret     = [];
                let tbl_chd = this.table().child();
                for (let tidx in tbl_chd) {
                    if ("1" !== tbl_chd[tidx].text()) {
                        continue;
                    }
                    for (let didx=tidx; didx < 48 ;didx++) {
                        if ("" === tbl_chd[didx].text()) {
                            return ret;
                        }
                        ret.push(tbl_chd[didx]);
                    }
                    break;
                }
                throw new Error('could not find day text');
            } else if ('number' === typeof prm) {
                let stoff  = 6;
                let daytxt = this.table().child();
                for (let didx in daytxt) {
                    if("1" === daytxt[didx].text()) {
                        stoff += parseInt(didx);
                        break;
                    }
                }
                
                if (undefined === daytxt[stoff + prm]) {
                    throw new Error('invalid parameter');
                }
                return daytxt[stoff + prm];
            } else {
                throw new Error('invalid parameter');
            }
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
                    this.todayStyle(dayTxt[upidx]);
                }
                
                dayTxt[upidx].text(fdt.getDate() + '');
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
    
    todayStyle (txt) {
        try {
            if (undefined === txt) {
                return;
            }
            txt.execOption({
                mainColor : new mf.Color('white'),
            });
            txt.adom().parent().style({
                'background' : 'rgba(113, 136, 153, 1)'
            });
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    hoverStyle (flg) {
        try {
            if (true === flg) {
                return {
                    'border' : 'solid 1px rgba(113, 136, 153, 1)'
                };
            } else if (false === flg) {
                return {
                    'border' : null
                };
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    dayClickEvent (fnc, prm) {
        try {
            if (undefined === fnc) {
                /* getter */
                return (undefined === this.m_dayclkevt) ? [undefined, undefined] : this.m_dayclkevt;
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
