// get buyer data
//   useEffect(() => {
//     console.log('buyer id', data?.[0]?.buyerId);
//     setBuyerId(data?.[0]?.buyerId);
//   }, [data]);

//   useEffect(() => {
//     if (buyerId) {
//       newRequest.get(`/users/${buyerId}`).then((res) => {
//         setUserBuyerData(res.data);
//       });
//     }
//   }, [buyerId]);
// console.log('userBuyerData',userBuyerData.username)

// // get seller data
//   useEffect(() => {
//     console.log('seller id', data?.[0]?.sellerId);
//     setSellerId(data?.[0]?.sellerId);
//   }, [data]);

//   useEffect(() => {
//     if (sellerId) {
//       newRequest.get(`/users/${sellerId}`).then((res) => {
//         setUserBuyerData(res.data);
//       });
//     }
//   }, [sellerId]);
// console.log('seller username',userSellerData.username)



import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  const conversationQueries = useQueries(
    data.map((c) => ({
      queryKey: ["conversation", c.id],
      queryFn: () =>
        newRequest.get(`/users/${currentUser.isSeller ? c.buyerId : c.sellerId}`).then((res) => {
          return res.data;
        }),
      // The following options are optional, but they can improve performance by preventing unnecessary refetching
      // when the user information changes.
      staleTime: Infinity,
      cacheTime: Infinity,
    }))
  );

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c, index) => (
                <tr
                  className={
                    ((currentUser.isSeller && !c.readBySeller) ||
                      (!currentUser.isSeller && !c.readByBuyer)) ?
                      "active" : ""
                  }
                  key={c.id}
                >
                  <td>{conversationQueries[index].isLoading ? "Loading..." :
                      conversationQueries[index].error ? "Error" :
                      conversationQueries[index].data.username
                  }</td>
                  <td>
                    <Link to={`/message/${c.id}`} className="link">
                      {c?.lastMessage?.substring(0, 100)}...
                    </Link>
                  </td>
                  <td>{moment(c.updatedAt).fromNow()}</td>
                  <td>
                    {((currentUser.isSeller && !c.readBySeller) ||
                      (!currentUser.isSeller && !c.readByBuyer)) && (
                      <button onClick={() => handleRead(c.id)}>
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr
