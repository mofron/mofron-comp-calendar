/**
 * @file   mofron-comp-calender/index.js
 * @author simpart
 */
const mf       = require('mofron');
const Text     = require('mofron-comp-text');
const Table    = require('mofron-comp-table');
const HrzPos   = require('mofron-effect-hrzpos');
const MousOver = require('mofron-event-mouseover');
const MousOut  = require('mofron-event-mouseout');
const Click    = require('mofron-event-click');

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
            
            /* week */
            let table = new Table({
                colLength : 7,
                child     : this.weekString()
            });
            this.child([
                new Text({
                    effect : [ new HrzPos('center') ],
                    size   : '0.4rem',
                    text   : ''
                }),
                table
            ]);
            
            /* day index text */
            let mous_evt = (tgt, mp) => {
                try {
                    tgt.adom().parent().style(
                        mp[0].hoverStyle(mp[1])
                    );
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            for (let idx=0; idx < 42; idx++) {
                table.execOption({
                    child : [
                        new Text({
                            text  : '',
                            event : [
                                new MousOver({
                                    handler : new mf.Param(mous_evt,[this,true])
                                }),
                                new MousOut({
                                    handler : new mf.Param(mous_evt,[this,false])
                                }),
                                new Click({
                                    handler : new mf.Param(
                                        (tgt, prm) => {
                                            try {
                                                if (null !== prm.dayClickEvent()) {
                                                    prm.dayClickEvent()[0](
                                                        tgt,
                                                        prm.dayClickEvent()[1]
                                                    );
                                                }
                                            } catch (e) {
                                                console.error(e.stack);
                                                throw e;
                                            }
                                        },
                                        this
                                    )
                                })
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
                let buf = this.getChild(true)[1].child();
                let ret = [];
                for (let bidx in buf) {
                    if (6 >= parseInt(bidx)) {
                        continue;
                    }
                    ret.push(buf[bidx]);
                }
                return ret;
            } else if ('number' === typeof prm) {
                let stoff  = 0;
                let daytxt = this.getDayText();
                for (let didx in daytxt) {
                    if("1" === daytxt[didx].text()) {
                        stoff = parseInt(didx);
                        break;
                    }
                }
                
                if (undefined === this.getDayText()[stoff + prm]) {
                    throw new Error('invalid parameter');
                }
                return this.getDayText()[stoff + prm];
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
            this.getChild(true)[0].execOption({
                text : (1 + prm.getMonth()) + ''
            });
            /* set day */
            this.m_date = prm;
            
            let fdt    = this.get1stDate();
            let dayTxt = this.getDayText();
            for (let upidx=0; upidx < 50 ;upidx++) {
                if (upidx < fdt.getDay()) {
                    continue;
                }
                if ( (31 < fdt.getDate()) || ((1 == fdt.getDate()) && (20 < upidx)) ) {
                    break;
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
