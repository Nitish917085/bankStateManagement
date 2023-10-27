import { axisData } from "../../data/axis";
import { hdfcData } from "../../data/hdfc";
import { iciciData } from "../../data/icici";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./Graph.css";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

const Graph = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["05/08/2023", "06/08/2023", "06/08/2023"],
    datasets: [
      {
        label: "Debit",
        borderColor: "rgba(75, 192, 192, 1)",
        data: [0],
      },
      {
        label: "Credit",
        borderColor: "rgba(192, 75, 192, 1)",
        data: [0],
      },
    ],
  });

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  useEffect(() => {
    const combinedData = [
      ...axisData.map((items) => ({ ...items, bank: "axis" })),
      ...iciciData.map((items) => ({ ...items, bank: "icici" })),
      ...hdfcData.map((items) => ({ ...items, bank: "hdfc" })),
    ];
    setData(combinedData);
  }, []);

  useEffect(() => {
    if (selectedCategory == "All") setFilteredData(data);
    else
      setFilteredData(
        data.filter((items) => items.Description === selectedCategory)
      );
  }, [selectedCategory]);

  useEffect(() => {
    const dates = filteredData.map((items) => items.Date);
    const debit = filteredData.map((items) => items.Debit);
    const credit = filteredData.map((items) => items.Credit);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Debit",
          borderColor: "rgba(75, 192, 192, 1)",
          data: debit,
        },
        {
          label: "Credit",
          borderColor: "rgba(192, 75, 192, 1)",
          data: credit,
        },
      ],
    });
  }, [filteredData]);

  useEffect(() => {
    var categories = [];
    data.forEach((items) => {
      if (!categories.includes(items.Description)) {
        categories.push(items.Description);
      }
    });
    setCategories(categories);
  }, [data]);

  return (
    <div className="graph">
      <div className="filterSelection">
        <div className="">
          {" "}
          <label>Select Type : </label>
          {categories && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled selected>
                Select Type
              </option>
              <option value="All">All</option>
              {categories.map((items) => (
                <option value={items}>{items}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      {chartData && (
        <Line
          style={{ height: "60%",width:"100%" }}
          data={chartData}
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default Graph;
