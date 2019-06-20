import React from "react";
import dayjs from "dayjs";

// tslint:disable-next-line:typedef
export default function Root(props: RootProps) {
  const [patientImages, setPatientImages] = React.useState(null);

  React.useEffect(() => {
    // tslint:disable-next-line:typedef
    const queryParams = `
            custom:(uuid:ref,comment:ref,obsDatetime:ref)
            `.replace(/\s/g, "");

    // tslint:disable-next-line:max-line-length
    fetch(
      // tslint:disable-next-line:max-line-length
      `/openmrs/ws/rest/v1/obs?conceptList=7cac8397-53cd-4f00-a6fe-028e8d743f8e,42ed45fd-f3f6-44b6-bfc2-8bde1bb41e00&patient=${props.patientUuid}&startIndex=0&v=${queryParams}`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(`Cannot fetch patient `);
        }
      })
      .then(img => {
        setPatientImages(img.results);
      });
  }, []);

  return patientImages ? renderAttachments() : renderLoader();

  function renderLoader(): any {
    return <div>Loading...</div>;
  }

  function renderAttachments(): any {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Attachments</h5>
        </div>
        <div className="row">
          {patientImages.map(image => {
            const { comment, obsDatetime, uuid } = image;
            // tslint:disable-next-line:max-line-length
            const url: string = `https://openmrs-spa.org/openmrs/ws/attachments/download?view=complexdata.view.original&obs=${uuid}`;
            return (
              <div className="col-4">
                <h5 className="card-title">
                  {dayjs(obsDatetime).format("YYYY-MMM-DD")}
                </h5>
                <img className="card-img-top" src={url} alt={comment} />
                <p className="card-text">{comment}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

type RootProps = {
  patientUuid: string;
};
