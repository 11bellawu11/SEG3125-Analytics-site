import React, { useEffect, useState, useMemo} from 'react';
import Papa from 'papaparse';
import { format } from 'date-fns';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer} from 'recharts';
import {BarChart, Bar, Rectangle} from 'recharts';
import dataCSV from '../data/Valve_Player_Data.csv';
import "./dashboard.css"


export default function Dashboard() {
    const [language, setLanguage] = useState('en');
    const [allData, setAllData] = useState([]);
    const [selectedGame, setGame] = useState('Counter Strike: Global Offensive');
    const [selectedYear, setYear] = useState('2021');
    const gameOptions = [...new Set(allData.map(row => row.Game_Name))];
    const yearOptions = [...new Set(allData.map(row =>
    row.Date instanceof Date && !isNaN(row.Date) ? row.Date.getFullYear() : null
    ))].filter(Boolean).sort();

    useEffect(() => {
    fetch(dataCSV)
        .then(res => res.text())
        .then(text => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: results => {
            const cleaned = results.data.map(row => ({
                Month_Year: row.Month_Year?.trim(),
                Date: new Date(row.Date?.trim()),
                Game_Name: row.Game_Name?.trim(),
                Avg_players: parseFloat(row.Avg_players?.replace(/,/g, '') || 0),
                Peak_Players: parseInt(row.Peak_Players?.replace(/,/g, '') || 0),
            }));
            setAllData(cleaned);
            }
        });
        });
    }, []);

    const DynamicData = allData
    .filter(row =>
        row.Game_Name === selectedGame &&
        row.Month_Year.includes((selectedYear))
    )
    .sort((a, b) => a.Date - b.Date)
    .map(row => ({
        date: row.Month_Year,
        avgPlayers: row.Avg_players
    }));

    const BarChartData = useMemo(() => {
    const filtered = allData.filter(row =>
        (row.Game_Name.includes("Counter Strike: Global Offensive") || row.Game_Name.includes("Dota 2") || row.Game_Name.includes("PUBG: Battlegrounds")) &&
        row.Month_Year.includes(("2020"))
    );

    // Group by Month_Year
    const grouped = {};
    filtered.forEach(row => {
        const key = row.Month_Year;
        const gameLabel = row.Game_Name === 'Counter Strike: Global Offensive' ? 'CSGO'
                        : row.Game_Name === 'Dota 2' ? 'Dota2'
                        : row.Game_Name === 'PUBG: Battlegrounds' ? 'PUBG'
                        : row.Game_Name;

        if (!grouped[key]) {
        grouped[key] = { date: key };
        }

        grouped[key][gameLabel] = row.Avg_players;
    });

    // Convert object to sorted array
    return Object.values(grouped).sort(
        (a, b) => new Date(`${a.date}-01`) - new Date(`${b.date}-01`)
    );
    }, [allData]);


    const translations = {
    en: {
        gameSelect: "Select a game:",
        yearSelect: "Year:",
        avgPlayers: "Average Players",
        language: "Language",
        month: "Month",
        January: "Jan",
        February: "Feb",
        March: "Mar",
        April: "Apr",
        May: "May",
        June: "Jun",
        July: "Jul",
        August: "Aug",
        September: "Sept",
        October: "Oct",
        November: "Nov",
        December: "Dec",
        pageTitle: "Steam Player Statistics",
        lineChartTitle: "Average players for " + selectedGame + " in " + selectedYear,
        barChartTitle: "2020 Average players for the top 3 games"
    },
    cn: {
        gameSelect: "游戏选择：",
        yearSelect: "年:",
        avgPlayers: "平均玩家",
        language: "语言",
        month: "月",
        January: "一月",
        February: "二月",
        March: "三月",
        April: "四月",
        May: "五月",
        June: "六月",
        July: "七月",
        August: "八月",
        September: "九月",
        October: "十月",
        November: "十一月",
        December: "十二月",
        pageTitle: "Steam 玩家统计数据",
        lineChartTitle: selectedYear + "里 " + selectedGame + " 的平均玩家",
        barChartTitle: "2020 前三名游戏的平均玩家"
    },
     fr: {
        gameSelect: "Sélectionnez un jeu：",
        yearSelect: "Année:",
        avgPlayers: "Joueurs Moyens",
        language: "Langue",
        month: "Mois",
        January: "Jan",
        February: "Feb",
        March: "Mar",
        April: "Apr",
        May: "May",
        June: "Jun",
        July: "Jul",
        August: "Aug",
        September: "Sept",
        October: "Oct",
        November: "Nov",
        December: "Dec",
        pageTitle: "Steam Player Statistics",
        lineChartTitle: "Joueurs moyens pour " + selectedGame + " en " + selectedYear,
        barChartTitle: "Moyenne des joueurs des trois meilleurs jeux en 2020"
    }
    };

    const lang = translations[language];

    const monthMap = {
    January: lang.January, February: lang.February, March: lang.March,
    April: lang.April, May: lang.May, June: lang.June,
    July: lang.July, August: lang.August, September: lang.September,
    October: lang.October, November: lang.November, December: lang.December,
    };

    function lineChart() {
        document.querySelector("#lineChartBlock").style.display= "block";
        document.querySelector("#barChartBlock").style.display= "none";
    }

    function barChart() {
        document.querySelector("#lineChartBlock").style.display= "none";
        document.querySelector("#barChartBlock").style.display= "block";
    }


  return (
    <div className="page">
        <div className="d-flex flex-wrap gap-3 mb-4">
            <div style={{marginRight: "60%"}}>
                <h3 style={{color: "white"}}>{lang.pageTitle}</h3>
            </div>
            <div className="mb-3 d-flex justify-content-end align-items-center gap-2">
                <label className="fw-bold" style={{color: "white"}} htmlFor="lang-select">{lang.language}:</label>
                <select
                    id="lang-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-select w-auto"
                >
                    <option value="en">English</option>
                    <option value="cn">简体中文</option>
                    <option value="fr">Francais</option>
                </select>
            </div>
        </div>
        
        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <div>
                <label className="fw-bold me-2" style={{color: "white"}}>{lang.gameSelect}</label>
                <select
                value={selectedGame}
                onChange={e => setGame(e.target.value)}
                className="form-select"
                >
                {gameOptions.map(game => (
                    <option key={game} value={game}>{game}</option>
                ))}
                </select>
            </div>

            <div >
                <label className="fw-bold me-2" style={{color: "white"}}>{lang.yearSelect}</label>
                <select
                value={selectedYear}
                onChange={e => setYear(parseInt(e.target.value))}
                className="form-select"
                >
                {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
                </select>
            </div>
        </div>
        <div className="chartRow" >
            <div style={{textAlign: "center", width: "50%"}}>
                <h5 style={{margin: "0", color: "white"}}>{lang.lineChartTitle}</h5>
                <ResponsiveContainer className="linechart" width="100%" height={600} style={{textAlign:"center"}}>
                    <LineChart data={DynamicData} margin={{ top: 20, left: 50, right: 50, bottom: 50 }}>
                    <CartesianGrid stroke="gray" strokeDasharray="3 3" />
                    <XAxis stroke='white' dataKey="date" tickFormatter={(label) => monthMap[label.split(' ')[0]]} inteval={0} angle={-45} textAnchor="end" height={80}>
                        <Label fill='white' value={lang.month} offset={-50} position="insideBottom" />
                    </XAxis>
                    <YAxis stroke='white' domain={[0, 1000000]}>
                        <Label fill='white' value={lang.avgPlayers} angle={-90} position="insideLeft" offset={-30} />
                    </YAxis>
                    <Tooltip />
                    <Legend/>
                    <Line name={lang.avgPlayers} type="monotone" dataKey="avgPlayers" stroke="#3db9cc" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={{textAlign: "center", width: "50%"}}>
                <h5 style={{margin: "0", color: "white"}}>{lang.barChartTitle}</h5>
                <ResponsiveContainer className="barChart" width="100%" height={620}>
                <BarChart data={BarChartData} margin={{ top: 20, left: 50, right: 50, bottom: 50 }}>
                    <CartesianGrid color='gray' strokeDasharray="3 3" />
                    <XAxis stroke='white' dataKey="date" tickFormatter={(label) => monthMap[label.split(' ')[0]]} inteval={0} angle={-45} textAnchor="end" height={100}>
                        <Label fill='white' value={lang.month} offset={-50} position="insideBottom" />
                    </XAxis>
                    <YAxis stroke='white' domain={[0, 1000000]}>
                        <Label fill='white' value={lang.avgPlayers} angle={-90} position="insideLeft" offset={-30} />
                    </YAxis>
                    <Tooltip cursor={false}/>
                    <Legend />
                    <Bar dataKey="CSGO" fill="#6060d6" />
                    <Bar dataKey="Dota2" fill="#b53840" />
                    <Bar dataKey="PUBG" fill="#c49331" />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
}