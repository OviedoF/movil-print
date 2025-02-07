import { BsArrowRight } from "react-icons/bs"
import styles from './Designs.module.scss'
import { useNavigate } from "react-router-dom"
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { makeQuery } from "../utils/api";
import ConfirmationModal from "../components/ConfirmationModal";
import { useDataContext } from "../context/data.context";

export default function Designs() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, name: "Dashboard" },
    { id: 2, name: "Users" },
    { id: 3, name: "Settings" },
    { id: 4, name: "Reports" },
    { id: 5, name: "Analytics" }
  ])
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { setConfirmationModal } = useDataContext();

  const handleDelete = () => {
    setConfirmationModal({
      isOpen: true,
      title: 'Eliminar todos los diseños',
      message: '¿Estás seguro de que deseas eliminar todos los diseños?',
      handleConfirm: () => {
        makeQuery(
          localStorage.getItem("token"),
          'deleteAllDesigns',
          {},
          enqueueSnackbar,
          () => {
            setItems([])
            enqueueSnackbar('Diseños eliminados', { variant: 'success' })
          },
          setLoading
        )
      }
    })
  };

  const getItems = async () => {
    makeQuery(
      localStorage.getItem("token"),
      'getDesigns',
      {},
      enqueueSnackbar,
      (data) => {
        setItems(data)
      },
      setLoading
    )
  }

  useEffect(() => {
    getItems()
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <button className={styles.buttonDelete} onClick={handleDelete}>
          Eliminar todos los diseños
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>Diseño</th>
              <th className={styles.headerCellRight}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className={styles.tableRow}>
                <td className={styles.cell}>{item.name}</td>
                <td className={styles.cellRight}>
                  <button
                    onClick={() => navigate(`/design/${item._id}`)}
                    className={styles.actionButton}
                  >
                    <BsArrowRight className={styles.icon} />
                    <span className={styles.srOnly}>Go to {item.name}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal />
    </div>
  )
}
