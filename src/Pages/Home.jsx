import { axisData } from "../data/axis";
import { hdfcData } from "../data/hdfc";
import { iciciData } from "../data/icici";
import "./Home.css";
import React, { useEffect, useState } from "react";
import Graph from "./Graph/Graph";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "Date", label: "Date", minWidth: 170 },
  { id: "bank", label: "Bank", minWidth: 100 },
  {
    id: "Description",
    label: "Description",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "Debit",
    label: "Debit",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "Credit",
    label: "Credit",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "Balance",
    label: "Balance",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

const Home = () => {
  const [data, setData] = useState([]);
  const [searchedKeyword, setSearchedKeyword] = useState("");
  var [startDate, setStartDate] = useState("");
  var [endDate, setEndDate] = useState(Date.now);
  const [selectedBank, setSelectedBank] = useState("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchResults, setSearchResults] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const currentDate = new Date().toISOString().split("T")[0];


  const filterResults = () => {
    var results = [];

    if (selectedBank !== "all") {
      results = data.filter(
        (item) => item.bank.toLowerCase() === selectedBank.toLowerCase()
      );
    } else {
      results = data.filter((item) => true);
    }

    results = results.filter((item) => {
      var itemDate = item.Date.split("/").reverse().join("-");
      return itemDate >= startDate && itemDate <= endDate;
    });

    results = results.filter((item) =>
      item.Description.toLowerCase().includes(searchedKeyword.toLowerCase())
    );

    setSearchResults(results);
  };

  useEffect(() => {
    filterResults();
  }, [searchedKeyword, selectedBank, startDate, endDate]);

  useEffect(() => {
    setStartDate("1997-10-12");
    setEndDate(currentDate);
    setData([
      ...data,
      ...axisData.map((items) => ({ ...items, bank: "axis" })),
      ...iciciData.map((items) => ({ ...items, bank: "icici" })),
      ...hdfcData.map((items) => ({ ...items, bank: "hdfc" })),
    ]);
    filterResults();
  }, []);

  return (
    <div className="container">
      <div className="tableView">
        <div className="transactionFilterView">
          <div className="filterSelection">
            <div className="searchKeyword">
              <input
                type="text"
                placeholder="Enter keyword"
                onChange={(e) => setSearchedKeyword(e.target.value)}
              />
            </div>
            <div className="">
              {" "}
              <label>Select Type : </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="all">All</option>
                <option value="hdfc">HDFC</option>
                <option value="icici">ICICI</option>
                <option value="axis">Axis</option>
              </select>
            </div>
          </div>

          <div className="dateSelection">
            <div>
              <label for="start">Start date: </label>
              <input
                type="date"
                value={startDate}
                min="1997-01-01"
                max={currentDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label for="start">End date: </label>
              <input
                type="date"
                value={endDate}
                min="2019-01-01"
                max={currentDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Paper
          sx={{ width: "100%", overflow: "hidden", backgroundColor: "#fae6ff" }}
        >
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: " #f0b3ff",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={searchResults.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ backgroundColor: "#f0b3ff" }}
          />
        </Paper>
      </div>

      <div className="graphView">
        <Graph />
      </div>
    </div>
  );
};

export default Home;
