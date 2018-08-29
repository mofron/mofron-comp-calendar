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
                    size   : 0.4,
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
            for (let idx=0; idx < 35; idx++) {
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
            this.size(6, 4);
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
                return this.getChild(true)[1].child();
            } else if ('number' === typeof prm) {
                if (undefined === this.getDayText()[prm]) {
                    throw new Error('invalid parameter');
                }
                return this.getDayText()[prm];
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
                return (undefined === this.m_date) ? null : this.m_date;
            }
            /* setter */
            /* set month */
            this.getChild(true)[0].execOption({
                text : (1 + prm.getMonth()) + ''
            });
            /* set day */
            let downdt  = new Date(prm.toString());
            let tbl_chd = this.getChild(true)[1].child();
            let off     = prm.getDay() + 7;
            /* up */
            for (let upidx=0; upidx < 31 ;upidx++) {
                if ((1 === prm.getDate()) && (0 !== upidx)) {
                    break;
                }
                
                this.getDayText(prm.getDate() + off).execOption({
                    text : prm.getDate() + ''
                });
                if (0 === upidx) {
                    this.todayStyle(this.getDayText(prm.getDate() + off));
                }
                
                prm.setDate(prm.getDate() + 1);
            }
            /* down */
            if (1 === downdt.getDate()) {
                return;
            }
            downdt.setDate(downdt.getDate()-1);
            for (let dwidx=31; dwidx > 0 ;dwidx--) {
                this.getDayText(downdt.getDate() + off).text(downdt.getDate() + '');
                if (1 === downdt.getDate()) {
                    break;
                }
                downdt.setDate(downdt.getDate()-1);
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
